from fastapi import FastAPI, Query, BackgroundTasks
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import warnings
from bs4 import XMLParsedAsHTMLWarning
warnings.filterwarnings('ignore', category=XMLParsedAsHTMLWarning)
import google.generativeai as genai
import yfinance as yf
import json
import uuid
from typing import Dict, Any
import psycopg2
import re

DATABASE_URL = 'postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

app = FastAPI()

GEMINI_API_KEY = "AQ.Ab8RN6KFeQIj-DGm0B7rhsUv0-RMebrXdf6pEPeX_R_4HCS_jw"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-flash-lite-latest')

class SummarizeResponse(BaseModel):
    success: bool
    title: str
    short_summary: str
    detailed_content: str
    hashtags: list[str]
    error: str | None = None

import holidays
from datetime import datetime

@app.get("/api/market-status")
async def get_market_status():
    import pytz
    
    # 한국 증시: 한국 시간 기준 00:00 갱신
    seoul_tz = pytz.timezone('Asia/Seoul')
    kr_today = datetime.now(seoul_tz).date()
    kr_is_holiday = kr_today.weekday() >= 5 or kr_today in holidays.KR()

    # 미국 증시: 미동부 시간 기준 00:00 갱신 (또는 한국 시간 기준으로 일괄 처리 원하시면 kr_today를 써도 됨)
    # 하지만 미국 휴일은 미국 날짜 기준으로 따지는게 맞음
    est_tz = pytz.timezone('US/Eastern')
    us_today = datetime.now(est_tz).date()
    us_is_holiday = us_today.weekday() >= 5 or us_today in holidays.US()

    return {
        "kr_closed": kr_is_holiday,
        "us_closed": us_is_holiday
    }

@app.get("/api/fear-and-greed")
async def get_fear_and_greed():
    try:
        response = requests.get('https://api.alternative.me/fng/', timeout=5)
        data = response.json()
        if 'data' in data and len(data['data']) > 0:
            item = data['data'][0]
            return {
                "success": True,
                "value": int(item['value']),
                "classification": item['value_classification']
            }
        return {"success": False, "error": "Invalid data format"}
    except Exception as e:
        return {"success": False, "error": str(e)}

import time
predict_cache = {"time": 0, "data": None}

@app.get("/api/market-predict")
async def get_market_predict():
    global futures_cache
    if not futures_cache.get("data"):
        return {"success": False, "error": "Cache not ready"}
    
    try:
        data = futures_cache["data"]["data"]
        ks_item = next((x for x in data["indices"] if x["symbol"] == "^KS11"), None)
        kq_item = next((x for x in data["indices"] if x["symbol"] == "^KQ11"), None)
        ewy_item = next((x for x in data["etf"] if x["symbol"] == "EWY"), None)
        usdkrw_item = next((x for x in data["fx_commodities"] if x["symbol"] == "USDKRW=X"), None)

        if not (ks_item and kq_item and ewy_item):
            return {"success": False, "error": "Data missing in cache"}

        result = {
            "success": True,
            "ewy": {
                "current": ewy_item["current"],
                "change_amt": ewy_item["change_amt"],
                "change_pct": ewy_item["change_pct"]
            },
            "usdkrw": {
                "current": usdkrw_item["current"],
                "change_amt": usdkrw_item["change_amt"],
                "change_pct": usdkrw_item["change_pct"]
            } if usdkrw_item else {"current": 0, "change_amt": 0, "change_pct": 0},
            "kospi": {
                "current": round(ks_item["current"] - ks_item["change_amt"], 2),
                "predicted": ks_item["current"],
                "change_amt": ks_item["change_amt"],
                "change_pct": ks_item["change_pct"]
            },
            "kosdaq": {
                "current": round(kq_item["current"] - kq_item["change_amt"], 2),
                "predicted": kq_item["current"],
                "change_amt": kq_item["change_amt"],
                "change_pct": kq_item["change_pct"]
            }
        }
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

futures_cache = {"time": 0, "data": None}

def update_market_futures_cache():
    global futures_cache
    tickers_to_fetch = {
        "kr_stocks": {
            "005930.KS": "삼성전자",
            "000660.KS": "SK하이닉스",
            "005380.KS": "현대차",
            "009150.KS": "삼성전기",
            "035420.KS": "NAVER",
            "042700.KS": "한미반도체",
            "066570.KS": "LG전자"
        },
        "etf": {
            "122630.KS": "KODEX 레버리지",
            "114800.KS": "KODEX 인버스",
            "EWY": "iShares MSCI South Korea ETF",
            "KORU": "한국 3배 ETF(KORU)",
            "SOXL": "미국 반도체 3배(SOXL)"
        },
        "us_stocks": {
            "TSLA": "테슬라",
            "NVDA": "엔비디아",
            "AAPL": "애플",
            "MSFT": "마이크로소프트",
            "GOOGL": "알파벳 A",
            "PLTR": "팔란티어",
            "INTC": "인텔",
            "AMD": "AMD"
        },
        "indices": {
            "^KS11": "코스피",
            "^KQ11": "코스닥",
            "NQ=F": "나스닥 100 선물",
            "ES=F": "S&P 500 선물"
        },
        "fx_commodities": {
            "USDKRW=X": "원/달러 환율",
            "GC=F": "금",
            "CL=F": "WTI 원유"
        },
        "crypto": {
            "BTC-USD": "비트코인",
            "ETH-USD": "이더리움",
            "SOL-USD": "솔라나",
            "XRP-USD": "리플"
        }
    }

    result = {
        "success": True,
        "data": {
            "kr_stocks": [],
            "etf": [],
            "us_stocks": [],
            "indices": [],
            "fx_commodities": [],
            "crypto": []
        }
    }

    try:
        import requests
        import urllib.request
        import json
        import hashlib
        import datetime
        import concurrent.futures

        # 1. Fetch FX Rate (USDKRW=X)
        fx_rate = 1350.0
        try:
            tk_fx = yf.Ticker("USDKRW=X")
            hist_fx = tk_fx.history(period="1d", interval="1m")
            if not hist_fx.empty:
                fx_rate = float(hist_fx['Close'].iloc[-1])
        except Exception:
            pass

        # 2. Fetch Hyperliquid PERPs
        hyperliquid_prices = {}
        try:
            res = requests.post('https://api.hyperliquid.xyz/info', json={'type': 'metaAndAssetCtxs'}, timeout=5).json()
            assets = res[0]['universe']
            ctxs = res[1]
            for i, asset in enumerate(assets):
                hyperliquid_prices[asset['name']] = float(ctxs[i]['markPx'])
        except Exception:
            pass

        # 3. Fetch US Big Tech & ADRs (for Priority 2 & 3 weights)
        us_tickers = ["NVDA", "MU", "SOXX", "PKX", "KEP", "SHG", "NQ=F"]
        us_data = {}
        
        def get_us_data(sym):
            try:
                tk = yf.Ticker(sym)
                hd = tk.history(period="5d")
                hl = tk.history(period="1d", interval="1m", prepost=True)
                if len(hd) >= 2:
                    last_time = hl.index[-1].time()
                    live_date = hl.index[-1].date()
                    last_daily_date = hd.index[-1].date()
                    if live_date > last_daily_date:
                        prev = float(hd['Close'].iloc[-1])
                    else:
                        if last_time >= datetime.time(16, 0):
                            prev = float(hd['Close'].iloc[-1])
                        else:
                            prev = float(hd['Close'].iloc[-2])
                    curr = float(hl['Close'].iloc[-1])
                    return {"prev": prev, "curr": curr, "change": (curr - prev)/prev}
            except Exception:
                pass
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_sym = {executor.submit(get_us_data, sym): sym for sym in us_tickers}
            for future in concurrent.futures.as_completed(future_to_sym):
                sym = future_to_sym[future]
                us_data[sym] = future.result()

        def fetch_naver_finance(queries):
            try:
                url = 'https://polling.finance.naver.com/api/realtime?query=' + ','.join(queries)
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                res = urllib.request.urlopen(req, timeout=5).read().decode('euc-kr', errors='replace')
                data = json.loads(res)
                result_map = {}
                for area in data.get('result', {}).get('areas', []):
                    for item in area.get('datas', []):
                        result_map[item['cd']] = item
                return result_map
            except Exception as e:
                print("Naver API Error:", e)
                return {}

        # 4. Fetch Function for standard assets (ETF, US Stocks, Indices, Crypto, FX)
        def fetch_ticker_data(symbol, name, category):
            try:
                if symbol.endswith('.KS') or symbol in ['^KS11', '^KQ11']:
                    query = ""
                    if symbol.endswith('.KS'):
                        query = f"SERVICE_ITEM:{symbol.replace('.KS', '')}"
                    elif symbol == '^KS11':
                        query = "SERVICE_INDEX:KOSPI"
                    elif symbol == '^KQ11':
                        query = "SERVICE_INDEX:KOSDAQ"
                    
                    n_data = fetch_naver_finance([query])
                    key = query.split(':')[1]
                    if n_data and key in n_data:
                        item = n_data[key]
                        curr = float(item.get('nv', 0))
                        if symbol in ['^KS11', '^KQ11']:
                            curr = curr / 100.0
                            change_amt = float(item.get('cv', 0)) / 100.0
                            prev = curr - change_amt
                            change_pct = (change_amt / prev) * 100 if prev != 0 else 0
                        else:
                            prev = float(item.get('pcv', item.get('sv', 0)))
                            change_amt = curr - prev
                            change_pct = (change_amt / prev) * 100 if prev != 0 else 0
                        
                        return category, {
                            "symbol": symbol,
                            "name": name,
                            "current": round(curr, 2),
                            "change_amt": round(change_amt, 2),
                            "change_pct": round(change_pct, 2),
                            "is_estimated": False
                        }

                tk = yf.Ticker(symbol)
                hist_daily = tk.history(period="5d")
                hist_live = tk.history(period="1d", interval="1m", prepost=True)
                
                if len(hist_daily) >= 2:
                    hd_clean = hist_daily['Close'].dropna()
                    hl_clean = hist_live['Close'].dropna()
                    if hist_live.empty or len(hl_clean) == 0:
                        prev = float(hd_clean.iloc[-2] if len(hd_clean) >= 2 else hd_clean.iloc[-1])
                        curr = float(hd_clean.iloc[-1])
                    else:
                        last_daily_date = hist_daily.index[-1].date()
                        live_date = hist_live.index[-1].date()
                        last_time = hist_live.index[-1].time()
                        
                        if live_date > last_daily_date:
                            prev = float(hd_clean.iloc[-1])
                        else:
                            if last_time >= datetime.time(16, 0):
                                prev = float(hl_clean.iloc[-1])
                            else:
                                prev = float(hd_clean.iloc[-2] if len(hd_clean) >= 2 else hd_clean.iloc[-1])
                            
                        curr = float(hl_clean.iloc[-1])
                elif len(hist_daily) == 1:
                    hd_clean = hist_daily['Close'].dropna()
                    if len(hd_clean) == 0:
                        return None
                    prev = float(hd_clean.iloc[0])
                    curr = float(hd_clean.iloc[0])
                    if not hist_live.empty:
                        curr = float(hist_live['Close'].iloc[-1])
                else:
                    return None
                    
                change_amt = curr - prev
                change_pct = (change_amt / prev) * 100 if prev != 0 else 0
                
                return category, {
                    "symbol": symbol,
                    "name": name,
                    "current": round(curr, 2),
                    "change_amt": round(change_amt, 2),
                    "change_pct": round(change_pct, 2),
                    "is_estimated": False
                }
            except Exception:
                return None

        # 5. Initialize Result Array
        result = {
            "success": True,
            "data": { cat: [None]*len(items) for cat, items in tickers_to_fetch.items() }
        }

        # 6. Execute fetches
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_idx = {}
            for cat, items in tickers_to_fetch.items():
                if cat != "kr_stocks":
                    for idx, (sym, name) in enumerate(items.items()):
                        future = executor.submit(fetch_ticker_data, sym, name, cat)
                        future_to_idx[future] = (cat, idx)
            
            for future in concurrent.futures.as_completed(future_to_idx):
                cat, idx = future_to_idx[future]
                res = future.result()
                if res:
                    _, data = res
                    result["data"][cat][idx] = data

        # 7. Multi-Source Engine for KR Stocks
        import pytz
        seoul_tz = pytz.timezone('Asia/Seoul')
        kr_now = datetime.datetime.now(seoul_tz)
        kr_today = kr_now.date()
        kr_is_holiday = kr_today.weekday() >= 5 or kr_today in holidays.KR()
        kr_open = kr_now.replace(hour=9, minute=0, second=0, microsecond=0)
        kr_close = kr_now.replace(hour=15, minute=30, second=0, microsecond=0)
        kr_is_open = not kr_is_holiday and (kr_open <= kr_now <= kr_close)
        
        is_estimation_window = True
        if not kr_is_holiday and (8 <= kr_now.hour < 20):
            is_estimation_window = False

        kr_stocks_config = {
            "005930.KS": {"perp": "SAMSUNG-PERP", "adr": None, "beta_sym": "NQ=F", "beta": 1.1},
            "000660.KS": {"perp": "HYNIX-PERP", "adr": None, "beta_sym": "MU", "beta": 0.8},
            "005380.KS": {"perp": "HYUNDAI-PERP", "adr": None, "beta_sym": "NQ=F", "beta": 0.5},
            "009150.KS": {"perp": "SEMCO-PERP", "adr": None, "beta_sym": "NQ=F", "beta": 1.2},
            "035420.KS": {"perp": "NAVER-PERP", "adr": None, "beta_sym": "NQ=F", "beta": 1.4},
            "042700.KS": {"perp": "HANMI-PERP", "adr": None, "beta_sym": "NVDA", "beta": 1.2},
            "066570.KS": {"perp": "LGE-PERP", "adr": None, "beta_sym": "NQ=F", "beta": 0.9}
        }

        kr_codes = [sym.replace('.KS', '') for sym in tickers_to_fetch["kr_stocks"].keys()]
        kr_naver_data = {}
        for code in kr_codes:
            res = fetch_naver_finance([f"SERVICE_ITEM:{code}"])
            if res: kr_naver_data.update(res)

        for idx, (sym, name) in enumerate(tickers_to_fetch["kr_stocks"].items()):
            try:
                code = sym.replace('.KS', '')
                n_data = kr_naver_data.get(code)
                if not n_data:
                    continue
                
                if kr_is_open:
                    curr = float(n_data.get('nv', 0))
                    prev = float(n_data.get('pcv', n_data.get('sv', 0)))
                    is_est = False
                else:
                    base_curr = float(n_data.get('nv', 0))
                    prev = float(n_data.get('pcv', n_data.get('sv', 0))) # 기본 기준가는 전일 종가
                    
                    nxt = n_data.get('nxtOverMarketPriceInfo')
                    
                    if not is_estimation_window:
                        # 08:00 ~ 09:00 프리장(장전 시간외)
                        if nxt and nxt.get('overMarketStatus') == 'OPEN' and nxt.get('overPrice'):
                            over_price_str = nxt['overPrice'].replace(',', '')
                            curr = float(over_price_str) if over_price_str.replace('.', '').isdigit() else base_curr
                        else:
                            curr = base_curr
                        is_est = False
                    else:
                        # 18:00 ~ 08:00 글로벌 야간 추종
                        # 야간 추종의 기준(0%)은 정규장 종가가 아니라 오늘장 최종 마감가(시간외 단일가 종가)
                        prev = base_curr
                        if nxt and nxt.get('overMarketStatus') == 'CLOSE' and nxt.get('overPrice'):
                            over_price_str = nxt['overPrice'].replace(',', '')
                            if over_price_str.replace('.', '').isdigit():
                                prev = float(over_price_str)
                                
                        info = kr_stocks_config.get(sym, {"perp": None, "adr": None, "beta_sym": "NQ=F", "beta": 1.0})
                        
                        # Waterfall Logic
                        curr = prev
                        if info["perp"] in hyperliquid_prices:
                            curr = hyperliquid_prices[info["perp"]] * fx_rate
                        elif info["adr"] and us_data.get(info["adr"]):
                            curr = prev * (1 + us_data[info["adr"]]["change"])
                        else:
                            beta_sym = info["beta_sym"]
                            ref_change = us_data[beta_sym]["change"] if us_data.get(beta_sym) else 0.0
                            seed = f"{sym}_{int(time.time()) // 10}"
                            hash_val = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
                            jitter = ((hash_val % 1000) / 1000.0) * 0.001 - 0.0005
                            adjusted_change = (ref_change * info["beta"]) + jitter
                            curr = prev * (1 + adjusted_change)
                        is_est = True
                    
                change_amt = curr - prev
                change_pct = (change_amt / prev) * 100 if prev != 0 else 0
                
                result["data"]["kr_stocks"][idx] = {
                    "symbol": sym,
                    "name": name,
                    "current": round(curr, 2),
                    "change_amt": round(change_amt, 2),
                    "change_pct": round(change_pct, 2),
                    "is_estimated": is_est
                }
            except Exception as e:
                print(f"Error on {sym}: {e}")

        # 8. Override frozen Korean Indices and ETFs with Estimated Prices
        # 한국장 개장 여부 실시간 확인
        import pytz
        seoul_tz = pytz.timezone('Asia/Seoul')
        kr_now = datetime.datetime.now(seoul_tz)
        kr_today = kr_now.date()
        kr_is_holiday = kr_today.weekday() >= 5 or kr_today in holidays.KR()
        kr_open = kr_now.replace(hour=9, minute=0, second=0, microsecond=0)
        kr_close = kr_now.replace(hour=15, minute=30, second=0, microsecond=0)
        # 한국장이 열려있으면 추정(estimation)을 하지 않음
        kr_is_open = not kr_is_holiday and (kr_open <= kr_now <= kr_close)
        
        is_estimation_window = True
        if not kr_is_holiday and (8 <= kr_now.hour < 20):
            is_estimation_window = False

        kr_frozen_config = {
            "^KS11": {"beta_sym": "NQ=F", "beta": 0.8},
            "^KQ11": {"beta_sym": "NQ=F", "beta": 1.2},
            "122630.KS": {"beta_sym": "NQ=F", "beta": 1.6},
            "114800.KS": {"beta_sym": "NQ=F", "beta": -0.8}
        }
        
        for cat in ["indices", "etf"]:
            if result["data"].get(cat):
                for item in result["data"][cat]:
                    if item and item["symbol"] in kr_frozen_config:
                        # 국장이 열려있거나, 추정 윈도우(20:00~08:00)가 아닐 경우 추정 계산 생략 (실제 주가 패스스루)
                        if kr_is_open or not is_estimation_window:
                            item["is_estimated"] = False
                            continue
                            
                        sym = item["symbol"]
                        info = kr_frozen_config[sym]
                        beta_sym = info["beta_sym"]
                        ref_change = us_data[beta_sym]["change"] if us_data.get(beta_sym) else 0.0
                        seed = f"{sym}_{int(time.time()) // 10}"
                        hash_val = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
                        jitter = ((hash_val % 1000) / 1000.0) * 0.001 - 0.0005
                        adjusted_change = (ref_change * info["beta"]) + jitter
                        
                        # Calculate original prev
                        prev = item["current"]
                            
                        curr = prev * (1 + adjusted_change)
                        change_amt = curr - prev
                        change_pct = (change_amt / prev) * 100 if prev != 0 else 0
                        
                        item["current"] = round(curr, 2)
                        item["change_amt"] = round(change_amt, 2)
                        item["change_pct"] = round(change_pct, 2)
                        item["is_estimated"] = True

        # Clean None and NaN values
        import math
        for cat in result["data"]:
            cleaned = []
            for x in result["data"][cat]:
                if x is not None:
                    # Sanitize NaNs to prevent JSON 500 Errors
                    if math.isnan(x.get("current", 0)): x["current"] = 0.0
                    if math.isnan(x.get("change_amt", 0)): x["change_amt"] = 0.0
                    if math.isnan(x.get("change_pct", 0)): x["change_pct"] = 0.0
                    cleaned.append(x)
            result["data"][cat] = cleaned
        
        futures_cache["data"] = result
        futures_cache["time"] = time.time()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Background fetch error:", e)

# FastAPI 시작 시 백그라운드 스레드 실행
import threading
def background_fetch_loop():
    while True:
        update_market_futures_cache()
        time.sleep(60)

threading.Thread(target=background_fetch_loop, daemon=True).start()

@app.get("/api/market-futures")
async def get_market_futures():
    global futures_cache
    if futures_cache["data"]:
        return futures_cache["data"]
    
    # 캐시가 아직 없으면 빈 기본값 반환
    return {
        "success": True,
        "data": {
            "kr_stocks": [],
            "etf": [],
            "us_stocks": [],
            "indices": [],
            "fx_commodities": [],
            "crypto": []
        }
    }



@app.get("/api/summarize-today", response_model=SummarizeResponse)
async def summarize_today_news(timeContext: str = Query(None)):
    try:
        import pytz
        today = datetime.now(pytz.timezone('Asia/Seoul')).date()
        is_weekend = today.weekday() >= 5
        is_kr_closed = is_weekend or today in holidays.KR()
        is_us_closed = is_weekend or today in holidays.US()

        # 7시(장전) 또는 20시(장마감)인데 양국 모두 휴장일 경우 스킵
        if timeContext in ["장전", "장마감 이후"] and is_kr_closed and is_us_closed:
            return SummarizeResponse(success=False, title="", short_summary="", detailed_content="", hashtags=[], error="SKIP")

        news_list = []

        # 실시간 속보 (최근 2시간) 수집
        if not is_kr_closed or timeContext == "점심":
            url_kr = "https://news.google.com/rss/search?q=%ED%95%9C%EA%B5%AD+%EC%A6%9D%EC%8B%9C+%EC%86%8D%EB%B3%B4+when:2h&hl=ko&gl=KR&ceid=KR:ko"
            res_kr = requests.get(url_kr)
            if res_kr.status_code == 200:
                soup = BeautifulSoup(res_kr.content, 'xml')
                items = soup.find_all('item')[:10]
                if items:
                    news_list.append("[한국 증시 실시간 속보]")
                    for item in items:
                        t = item.find('title')
                        if t: news_list.append(f"- {t.text.strip()}")
        else:
            news_list.append("[한국 증시 실시간 속보]\n금일 한국 증시는 휴장입니다.")

        if not is_us_closed or timeContext == "점심":
            url_us = "https://news.google.com/rss/search?q=stock+market+breaking+news+when:2h&hl=en&gl=US&ceid=US:en"
            res_us = requests.get(url_us)
            if res_us.status_code == 200:
                soup = BeautifulSoup(res_us.content, 'xml')
                items = soup.find_all('item')[:10]
                if items:
                    news_list.append("\n[미국 증시 실시간 속보]")
                    for item in items:
                        t = item.find('title')
                        if t: news_list.append(f"- {t.text.strip()}")
        else:
            news_list.append("\n[미국 증시 실시간 속보]\n금일 미국 증시는 휴장입니다.")

        if not news_list:
            return SummarizeResponse(success=False, title="", short_summary="", detailed_content="", hashtags=[], error="뉴스를 찾을 수 없습니다.")
        
        all_news_text = "\n".join(news_list)
        
        now = datetime.now(pytz.timezone('Asia/Seoul'))
        today_str = now.strftime("%Y년 %m월 %d일 %H:%M")
        
        prompt = (
            f"현재 시각: {today_str}\n"
            "너는 주식 시장의 핵심을 찌르는 트렌디한 애널리스트야.\n"
            "아래 제공된 '최근 2시간 이내 실시간 속보' 기사들을 분석해서, 지금 당장 일어나는 **개실시간 핵심 이슈들만 아주 간략히** 요약해줘.\n"
            "지루한 전체 시황이나 긴 글은 절대 금지. 빠르고 직관적으로 읽을 수 있게 불릿 포인트나 짧은 문장 위주로 타격감 있게 작성할 것.\n"
            "글의 가독성을 높이기 위해 이모지를 적당히 섞어 넣고, 반드시 마크다운 포맷( ```json 텍스트 블록 안)의 JSON 구조로 출력해줘.\n"
            "리포트 본문(detailed_content)은 [🔥 실시간 핫이슈] 등 자유롭고 임팩트 있는 짧은 섹션으로 구성할 것.\n\n"
            "형식:\n"
            "{\n"
            '  "title": "실시간 속보: 핵심 이슈 제목",\n'
            '  "short_summary": "현재 상황 1~2줄 요약",\n'
            '  "detailed_content": ["[🔥 실시간 핫이슈]\\n- 내용..."],\n'
            '  "hashtags": ["해시태그1", "해시태그2"]\n'
            "}\n\n"
            f"최근 2시간 실시간 속보:\n{all_news_text}"
        )
        response_gen = model.generate_content(prompt)
        result_text = response_gen.text.strip()
        result_text = re.sub(r'^```(?:json)?\s*', '', result_text, flags=re.IGNORECASE)
        result_text = re.sub(r'\s*```$', '', result_text).strip()
        result_json = json.loads(result_text)
        
        title = result_json.get("title", f"실시간 증시 속보 ({today_str})")
        short_summary = result_json.get("short_summary", "")
        hashtags = result_json.get("hashtags", [])
        detailed_list = result_json.get("detailed_content", [])
        
        detailed_content_lines = []
        for line in detailed_list:
            if ":" in line:
                head, tail = line.split(":", 1)
                detailed_content_lines.append(f"**{head.strip()}**\n{tail.strip()}\n")
            elif "-" in line:
                head, tail = line.split("-", 1)
                detailed_content_lines.append(f"**{head.strip()}**\n{tail.strip()}\n")
            else:
                detailed_content_lines.append(f"{line.strip()}\n")
                
        detailed_content = "\n".join(detailed_content_lines).strip()
        return SummarizeResponse(success=True, title=title, short_summary=short_summary, detailed_content=detailed_content, hashtags=hashtags)
    except Exception as e:
        return SummarizeResponse(success=False, title="", short_summary="", detailed_content="", hashtags=[], error=str(e))

jobs: Dict[str, Any] = {}

def get_tier(cp: int) -> str:
    if cp >= 99000000: return "🌌 전왕(제노)급"
    if cp >= 95000000: return "⚪ 대신관급"
    if cp >= 90000000: return "💫 파괴신 비루스급"
    if cp >= 85000000: return "🌀 위스급 천사"
    if cp >= 80000000: return "🔵 초사이어인 블루"
    if cp >= 75000000: return "🔴 초사이어인 갓"
    if cp >= 70000000: return "💎 지렌급 (우주최강)"
    if cp >= 65000000: return "⚡ 초사이어인 3"
    if cp >= 58000000: return "🌀 고텐크스(퓨전)"
    if cp >= 52000000: return "💥 초사이어인 2"
    if cp >= 45000000: return "🩷 마인부우급"
    if cp >= 38000000: return "🐉 SSJ2 고한급"
    if cp >= 30000000: return "💚 완전체 셀급"
    if cp >= 22000000: return "🤖 인조인간 17호급"
    if cp >= 15000000: return "🟢 세미 퍼펙트 셀급"
    if cp >= 10000000: return "🧬 임퍼펙트 셀급"
    if cp >= 6000000:  return "☀️ 초사이어인 오공"
    if cp >= 3000000:  return "👊 나메크 전사급"
    if cp >= 1500000:  return "🧤 크리링/야무치급"
    if cp >= 700000:   return "❄️ 프리저 최종형태"
    if cp >= 300000:   return "🦎 바독(반란군)급"
    if cp >= 100000:   return "👾 기뉴 특전대급"
    if cp >= 30000:    return "🔴 자르본/도도리아"
    if cp >= 10000:    return "💀 라데츠급 전사"
    if cp >= 3000:     return "🐢 굴도급 (최약체)"
    if cp >= 500:      return "😢 야무치급 전사"
    if cp >= 100:      return "🙏 미스터 사탄급"
    if cp >= 10:       return "🏡 옥스킹 마을사람"
    return "🌾 전투력: 5 농부"

def process_scout(job_id: str, stockName: str):
    try:
        jobs[job_id] = {"status": "running"}

        ticker_prompt = (
            f"'{stockName}' 기업의 Yahoo Finance 티커와 사람들이 일반적으로 부르는 친숙하고 짧은 기업명(주식회사 등 꼬리표 제외)을 JSON으로만 출력해. 마크다운 금지.\n"
            "한국 유가증권(코스피) 종목은 .KS, 코스닥 종목은 .KQ 접미사를 반드시 붙여야 해.\n"
            "만약 사용자가 입력한 문자열이 영문 알파벳(예: AAPL, SOXL, KORU)으로만 구성되어 있다면, 그것을 무조건 미국 주식/ETF의 티커로 우선 간주하고 분석해. 억지로 발음이 비슷한 한국 기업(예: KORU -> 코루파마)으로 왜곡하지 마.\n"
            "예시:\n"
            '  삼성전자주식회사 -> {"ticker":"005930.KS","realName":"삼성전자"}\n'
            '  에스엠씨지(유리용기회사) -> {"ticker":"460870.KQ","realName":"에스엠씨지"}\n'
            '  엔비디아 -> {"ticker":"NVDA","realName":"NVIDIA"}\n'
            '  KORU -> {"ticker":"KORU","realName":"Direxion Daily South Korea Bull 3X Shares"}\n'
            f'출력: {{"ticker":"티커","realName":"짧은기업명"}}'
        )
        ticker_res = model.generate_content(ticker_prompt)
        t_text = ticker_res.text.strip()
        t_text = re.sub(r'^```(?:json)?\s*', '', t_text, flags=re.IGNORECASE)
        t_text = re.sub(r'\s*```$', '', t_text).strip()
        try:
            t_json = json.loads(t_text)
            ticker = t_json.get("ticker", "").strip().upper()
            real_stock_name = t_json.get("realName", stockName).strip()
        except:
            ticker = t_text.strip().upper()
            real_stock_name = stockName

        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty:
            raise ValueError(f"종목을 찾을 수 없습니다. 정확한 종목명이나 티커를 입력해 주세요. (AI 추정 티커: {ticker})")

        try:
            fi = stock.fast_info
            _lp = fi.last_price
            _yh = fi.year_high
            _yl = fi.year_low
            current_price = _lp if (_lp and _lp > 0) else float(hist['Close'].iloc[-1])
            high_1y = _yh if (_yh and _yh > 0) else float(hist['High'].max())
            low_1y = _yl if (_yl and _yl > 0) else float(hist['Low'].min())
        except Exception:
            current_price = float(hist['Close'].iloc[-1])
            high_1y = float(hist['High'].max())
            low_1y = float(hist['Low'].min())

        volume = int(hist['Volume'].iloc[-1])
        currency = "$" if not ticker.endswith((".KS", ".KQ")) else "₩"
        price_ratio = round((current_price / high_1y) * 100, 1) if high_1y and high_1y > 0 else 50.0
        if volume < 100000: volume_ratio_hint = "극빈"
        elif volume < 1000000: volume_ratio_hint = "빈약"
        elif volume < 10000000: volume_ratio_hint = "보통"
        else: volume_ratio_hint = "풍부"

        recent_news_text = "최근 관련 뉴스 데이터가 없습니다."
        try:
            news_items = stock.news
            if news_items:
                titles = [f"- {n.get('title', '')}" for n in news_items[:5] if n.get('title')]
                if titles:
                    recent_news_text = "\n".join(titles)
        except Exception:
            pass

        scouter_prompt = (
            f"너는 드래곤볼 스카우터 컨셉의 전투적인 주식 스카우터 AI야. "
            f"말투는 프리저나 베지터처럼 건방지고 자신감 넘치는 반말을 사용해.\n"
            f"기본적으로는 구체적 수치를 근거로 타격감 넘치는 팩폭을 갈기되, "
            f"만약 종목 상태가 압도적으로 좋고 상승세가 무섭다면(전투력이 7000만 이상 등) 무지성으로 비난하지 말고, 그 압도적인 강함을 인정하며 '좋은 의미의 팩폭(극찬과 경악)'을 해줘. 왜 강한지 펀더멘털이나 모멘텀 이유를 짧게 언급해라.\n"
            f"반대로 쓰레기 종목이면 왜 쓰레기인지 구체적인 이유(재무상태, 악재 뉴스, 경쟁력 상실 등)를 들며 가차 없이 무자비하게 짓밟아라.\n\n"
            f"종목: {real_stock_name} (티커: {ticker})\n"
            f"현재가: {currency}{current_price:.2f}, 52주 최고가: {currency}{high_1y:.2f}, 52주 최저가: {currency}{low_1y:.2f}\n"
            f"현재가/최고가 비율: {price_ratio}%, 거래량 수준: {volume_ratio_hint}({volume:,})\n\n"
            f"[최근 실제 관련 뉴스 헤드라인 (이걸 바탕으로 분석해!)]\n{recent_news_text}\n\n"
            "[전투력 산정 기준 - 반드시 이 기준으로 계산해]:\n"
            "- 현재가/최고가 90%이상 + 거래량 풍부 -> 70000000 ~ 100000000\n"
            "- 현재가/최고가 70~90% + 거래량 보통 이상 -> 30000000 ~ 70000000\n"
            "- 현재가/최고가 50~70% -> 5000000 ~ 30000000\n"
            "- 현재가/최고가 30~50% -> 500000 ~ 5000000\n"
            "- 현재가/최고가 10~30% -> 10000 ~ 500000\n"
            "- 현재가/최고가 10% 미만 또는 거래량 극빈 -> 100 ~ 10000\n\n"
            "위 기준 엄격 준수. combatPower는 1~100000000 사이 순수 정수만.\n"
            "goodNews/badNews는 제공된 '실제 뉴스 헤드라인'을 바탕으로 **현시점 가장 크리티컬한 호재와 악재**를 각각 1줄로 강력하게 요약해. 뉴스가 없다면 차트/시장 흐름을 통해 추정해서 써.\n"
            "comment는 단순한 조롱이 아니라 **설득력 있는 팩폭**이어야 해. 이 종목이 왜 지리는지, 혹은 왜 쓰레기인지 뼈때리는 비유와 함께 2~3줄로 설명해. 줄바꿈은 \\n.\n"
            "tier 필드 넣지마. 마크다운 금지.\n"
            f'출력: {{"combatPower": 15400, "goodNews": "현재 가장 강력한 찐 호재 요약", "badNews": "주가를 갉아먹는 치명적 악재 요약", "comment": "뼈때리는 팩트폭력 코멘트\\n설득력 있는 이유 추가"}}'
        )

        scout_res = model.generate_content(scouter_prompt)
        result_text = scout_res.text.strip()
        result_text = re.sub(r'^```(?:json)?\s*', '', result_text, flags=re.IGNORECASE)
        result_text = re.sub(r'\s*```$', '', result_text).strip()
        result_text = result_text.replace('\\"', '"')

        try:
            result_json = json.loads(result_text)
        except Exception:
            import ast
            try:
                result_json = ast.literal_eval(result_text)
            except:
                raise ValueError(f"AI 응답을 파싱할 수 없습니다: {result_text}")

        comment = result_json.get("comment", "분석 불가")
        if isinstance(comment, str):
            comment = comment.replace("\\n", "\n")

        _cp = int(re.sub(r"[^0-9]", "", str(result_json.get("combatPower", 0))) or 0)
        if _cp > 100000000: _cp = 100000000

        result_data = {
            "status": "done",
            "success": True,
            "stockName": real_stock_name,
            "ticker": ticker,
            "currency": currency,
            "combatPower": _cp,
            "tier": get_tier(_cp),
            "goodNews": result_json.get("goodNews", "-"),
            "badNews": result_json.get("badNews", "-"),
            "comment": comment,
            "currentPrice": float(current_price) if current_price else 0,
            "yearHigh": float(high_1y) if high_1y else 0,
            "yearLow": float(low_1y) if low_1y else 0
        }
        jobs[job_id] = result_data

        try:
            conn = psycopg2.connect(DATABASE_URL)
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO scout_cache (stock_name, result_json, created_at) VALUES (%s, %s, NOW() AT TIME ZONE 'Asia/Seoul') ON CONFLICT (stock_name) DO UPDATE SET result_json = EXCLUDED.result_json, created_at = NOW() AT TIME ZONE 'Asia/Seoul'",
                (stockName, json.dumps(result_data, ensure_ascii=False))
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as db_e:
            print("DB Cache Save Error:", db_e)

    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Quota" in error_msg:
            error_msg = "오늘 제공된 무료 API 호출 한도를 모두 소진했습니다. 😭"
        jobs[job_id] = {"status": "error", "success": False, "error": error_msg}

@app.get("/api/scout")
async def start_scout(background_tasks: BackgroundTasks, stockName: str = Query(..., min_length=1)):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute(
            "SELECT result_json, created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' "
            "FROM scout_cache WHERE stock_name = %s ORDER BY created_at DESC LIMIT 1",
            (stockName,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            from datetime import timedelta
            import pytz
            
            result_json_str = row[0]
            created_at = row[1]
            cached_date = created_at.date()
            today = datetime.now(pytz.timezone('Asia/Seoul')).date()
            
            use_cache = False
            if cached_date == today:
                use_cache = True
            else:
                cached_data = json.loads(result_json_str)
                ticker = cached_data.get("ticker", "")
                is_kr = ticker.endswith((".KS", ".KQ"))
                hols = holidays.KR() if is_kr else holidays.US()
                
                is_closed_today = today.weekday() >= 5 or today in hols
                if is_closed_today:
                    last_trading_day = today - timedelta(days=1)
                    while last_trading_day.weekday() >= 5 or last_trading_day in hols:
                        last_trading_day -= timedelta(days=1)
                    
                    if cached_date >= last_trading_day:
                        use_cache = True
                        
            if use_cache:
                cached_data = json.loads(result_json_str)
                cached_data["status"] = "done"
                cached_data["success"] = True
                if "jobId" in cached_data:
                    del cached_data["jobId"]
                return cached_data
    except Exception as e:
        print("Cache read error:", e)

    job_id = str(uuid.uuid4())
    background_tasks.add_task(process_scout, job_id, stockName)
    return {"jobId": job_id, "status": "pending"}

@app.get("/api/scout/result")
async def get_scout_result(jobId: str = Query(...)):
    if jobId not in jobs:
        return {"status": "error", "error": "Job not found"}
    return jobs[jobId]
