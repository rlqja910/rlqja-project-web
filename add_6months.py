import requests
import time

BACKEND_API_URL = "http://13.124.135.106:8080/api/admin/buybacks"

recent_deals = [
    {
        "companyName": "삼성물산",
        "ticker": "028260",
        "targetValue": 10289,
        "currentValue": 10289,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "기업 밸류업 선봉장! 1조 원 대규모 자사주 전량 소각 완료 🚀"
    },
    {
        "companyName": "KT&G",
        "ticker": "033780",
        "targetValue": 8617,
        "currentValue": 8617,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "주주환원율 최고 수준! 8,600억 규모 통큰 소각 🚬"
    },
    {
        "companyName": "KT",
        "ticker": "030200",
        "targetValue": 1789,
        "currentValue": 1789,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "통신주 배당 매력 UP! 1,789억 소각 완료 📱"
    },
    {
        "companyName": "하나금융지주",
        "ticker": "086790",
        "targetValue": 3000,
        "currentValue": 3000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "4대 금융지주 밸류업 동참! 3천억 소각 💰"
    },
    {
        "companyName": "미래에셋증권",
        "ticker": "006800",
        "targetValue": 822,
        "currentValue": 822,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "증권가 밸류업 대장! 822억 자사주 매입 및 소각 📈"
    },
    {
        "companyName": "네이버",
        "ticker": "035420",
        "targetValue": 3053,
        "currentValue": 3053,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "빅테크 주주환원! 3,000억 규모 자사주 소각 완료 🟢"
    },
    {
        "companyName": "카카오",
        "ticker": "035720",
        "targetValue": 1200,
        "currentValue": 1200,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "사법 리스크 돌파구! 1,200억 주주 달래기 소각 🟡"
    },
    {
        "companyName": "현대자동차",
        "ticker": "005380",
        "targetValue": 4000,
        "currentValue": 4000,
        "unit": "억 원",
        "marketType": "KOSPI",
        "comment": "역대급 실적 바탕으로 4천억 화끈하게 불태움 🚗"
    }
]

def run_bulk_import():
    print(f"========== Starting Bulk Import of {len(recent_deals)} recent buybacks ==========")
    for deal in recent_deals:
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
