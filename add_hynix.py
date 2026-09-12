import requests

res = requests.post(
    'http://13.124.135.106:8080/api/admin/buybacks', 
    json={
        'companyName': 'SK하이닉스', 
        'ticker': '000660', 
        'targetValue': 400000, 
        'currentValue': 0, 
        'unit': '억 원', 
        'marketType': 'KOSPI', 
        'comment': '국내 상장사 역사상 최대 규모인 40조 원 자사주 매입 후 즉시 전량 소각 발표! 🔥'
    }
)
print("SK Hynix added! Status:", res.status_code)
