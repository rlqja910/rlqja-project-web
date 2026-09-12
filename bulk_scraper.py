import requests
import json
import time

BACKEND_API_URL = "http://13.124.135.106:8080/api/admin/buybacks"

# 대규모 자사주 매입/소각 중인 KOSPI/KOSDAQ 종목 하드코딩 리스트 (MVP용 시뮬레이션 데이터)
# 실제 전종목 100% 동기화를 위해서는 DART Open API 발급이 필요함.
historical_big_deals = [
    {
        "companyName": "삼성전자",
        "ticker": "005930",
        "targetValue": 100000,
        "currentValue": 30000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "외국인 매도 방어를 위한 역대급 10조 원 밸류업 선언! 국장 구원투수 🚀"
    },
    {
        "companyName": "기아",
        "ticker": "000270",
        "targetValue": 5000,
        "currentValue": 5000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "약속의 5천억! 취득 완료 후 깔끔하게 불태웠습니다 🚀"
    },
    {
        "companyName": "SK이노베이션",
        "ticker": "096770",
        "targetValue": 7936,
        "currentValue": 0,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "합병 비율 논란 잠재우는 역대급 7,936억 소각 결정!"
    },
    {
        "companyName": "메리츠금융지주",
        "ticker": "138040",
        "targetValue": 5000,
        "currentValue": 2300,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "주주환원의 정석! 5,000억 원 자사주 매입 후 전량 소각 중 🔥"
    },
    {
        "companyName": "KB금융",
        "ticker": "105560",
        "targetValue": 4000,
        "currentValue": 4000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "금융주 대장다운 화끈한 4천억 밸류업!"
    },
    {
        "companyName": "신한지주",
        "ticker": "055550",
        "targetValue": 3000,
        "currentValue": 1500,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "KB금융에 질 수 없다! 3천억 매입 및 소각 진행 중 💸"
    },
    {
        "companyName": "셀트리온",
        "ticker": "068270",
        "targetValue": 1000,
        "currentValue": 1000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "주가 방어를 위해 1천억 긴급 수혈 완료!"
    },
    {
        "companyName": "우리금융지주",
        "ticker": "316140",
        "targetValue": 1200,
        "currentValue": 500,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "우리도 밸류업! 1200억 자사주 매입 시작 📈"
    },
    {
        "companyName": "JYP Ent.",
        "ticker": "035900",
        "targetValue": 100,
        "currentValue": 50,
        "unit": "억 원",
        "marketType": "KOSDAQ",
        "comment": "박진영의 결단! 100억 자사주 매입으로 엔터주 반등 노린다 🎸"
    },
    {
        "companyName": "에코프로비엠",
        "ticker": "247540",
        "targetValue": 200,
        "currentValue": 200,
        "unit": "억 원",
        "marketType": "KOSDAQ",
        "comment": "이차전지 대장주의 200억 주주달래기 완료 🔋"
    },
    {
        "companyName": "리노공업",
        "ticker": "058470",
        "targetValue": 150,
        "currentValue": 0,
        "unit": "억 원",
        "marketType": "KOSDAQ",
        "comment": "반도체 소부장 대장다운 150억 자사주 펀드 가입 칩 🚀"
    },
    {
        "companyName": "클래시스",
        "ticker": "214150",
        "targetValue": 120,
        "currentValue": 80,
        "unit": "억 원",
        "marketType": "KOSDAQ",
        "comment": "미용기기 돈 복사기! 120억 자사주 매입하며 슈링크로 주름 쫙 핌 💉"
    }
]

def run_bulk_import():
    print(f"========== Starting Bulk Import of {len(historical_big_deals)} historical buybacks ==========")
    for deal in historical_big_deals:
        try:
            res = requests.post(BACKEND_API_URL, json=deal)
            if res.status_code in [200, 201]:
                print(f"[BulkScraper] Successfully inserted: {deal['companyName']}")
            else:
                print(f"[BulkScraper] Failed to insert {deal['companyName']}. Status: {res.status_code}")
        except Exception as e:
            print(f"[BulkScraper] Error inserting {deal['companyName']}: {e}")
        time.sleep(0.1)
        
if __name__ == "__main__":
    run_bulk_import()
