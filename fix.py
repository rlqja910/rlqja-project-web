import sys

def patch():
    with open('python-worker/main.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix kr_stocks fetch
    target1 = """        kr_queries = [f"SERVICE_ITEM:{code}" for code in kr_codes]
        kr_naver_data = fetch_naver_finance(kr_queries)"""
    
    replace1 = """        kr_naver_data = {}
        for code in kr_codes:
            res = fetch_naver_finance([f"SERVICE_ITEM:{code}"])
            if res: kr_naver_data.update(res)"""
            
    content = content.replace(target1, replace1)

    # 2. Fix prev price logic
    target2 = """                else:
                    # 장이 닫혀있을 때 기본 prev는 전일 종가(pcv)여야 프리장 등락률이 계산됨
                    prev = float(n_data.get('pcv', n_data.get('sv', 0)))
                    base_curr = float(n_data.get('nv', 0))
                    
                    nxt = n_data.get('nxtOverMarketPriceInfo')
                    
                    if nxt and nxt.get('overMarketStatus') == 'CLOSE' and nxt.get('overPrice'):
                        over_price_str = nxt['overPrice'].replace(',', '')
                        curr = float(over_price_str) if over_price_str.replace('.', '').isdigit() else base_curr
                        is_est = False
                    elif not is_estimation_window:
                        # 프리장(08:00~09:00) 등 추정 시간이 아니면, 실제 현재가(nv)를 그대로 사용
                        curr = base_curr
                        is_est = False
                    else:"""
                    
    replace2 = """                else:
                    base_curr = float(n_data.get('nv', 0))
                    prev = base_curr
                    
                    nxt = n_data.get('nxtOverMarketPriceInfo')
                    if nxt and nxt.get('overMarketStatus') == 'CLOSE' and nxt.get('overPrice'):
                        over_price_str = nxt['overPrice'].replace(',', '')
                        if over_price_str.replace('.', '').isdigit():
                            prev = float(over_price_str)
                    
                    if not is_estimation_window:
                        curr = prev
                        is_est = False
                    else:"""
                    
    content = content.replace(target2, replace2)

    # 3. Fix waterfall logic
    target3 = """                        # Waterfall Logic
                        curr = base_curr
                        if info["perp"] in hyperliquid_prices:
                            curr = hyperliquid_prices[info["perp"]] * fx_rate
                        elif info["adr"] and us_data.get(info["adr"]):
                            curr = base_curr * (1 + us_data[info["adr"]]["change"])
                        else:
                            beta_sym = info["beta_sym"]
                            ref_change = us_data[beta_sym]["change"] if us_data.get(beta_sym) else 0.0
                            seed = f"{sym}_{int(time.time()) // 10}"
                            hash_val = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
                            jitter = ((hash_val % 1000) / 1000.0) * 0.001 - 0.0005
                            adjusted_change = (ref_change * info["beta"]) + jitter
                            curr = base_curr * (1 + adjusted_change)"""

    replace3 = """                        # Waterfall Logic
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
                            curr = prev * (1 + adjusted_change)"""

    content = content.replace(target3, replace3)

    with open('python-worker/main.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Patched successfully!")

if __name__ == '__main__':
    patch()
