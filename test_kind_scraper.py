import requests
from bs4 import BeautifulSoup

url = "https://kind.krx.co.kr/disclosure/details.do"
payload = {
    "method": "searchDetails",
    "currentPageSize": "100",
    "pageIndex": "1",
    "orderMode": "1",
    "orderStat": "D",
    "forward": "details_dtl",
    "reportNm": "자기주식취득",
    "fromDate": "2024-01-01",
    "toDate": "2024-12-31",
}
headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded"
}

res = requests.post(url, data=payload, headers=headers)
soup = BeautifulSoup(res.text, "html.parser")

table = soup.find("table", class_="list")
if table:
    rows = table.find("tbody").find_all("tr")
    print(f"Found {len(rows)} announcements!")
    for row in rows[:5]:
        cols = row.find_all("td")
        if len(cols) >= 4:
            company = cols[0].text.strip()
            title = cols[3].text.strip()
            print(f"Company: {company}, Title: {title}")
else:
    print("Table not found!")
