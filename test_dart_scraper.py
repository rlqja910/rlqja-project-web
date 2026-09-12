import requests
from bs4 import BeautifulSoup
import re

def scrape_dart():
    url = "https://dart.fss.or.kr/dsab001/search.ax"
    payload = {
        "startDate": "20240227",
        "endDate": "20260827",
        "reportName": "자기주식취득결정",
        "maxResults": "100",
        "maxLinks": "10",
        "page_set": "1"
    }
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    print("Requesting DART...")
    res = requests.post(url, data=payload, headers=headers)
    print(res.status_code)
    
    soup = BeautifulSoup(res.text, 'html.parser')
    table = soup.find('div', class_='table_list')
    if table:
        rows = table.find('tbody').find_all('tr')
        print(f"Found {len(rows)} rows!")
        for row in rows[:5]:
            cols = row.find_all('td')
            if len(cols) >= 3:
                company = cols[1].text.strip()
                title = cols[2].text.strip()
                print(f"Company: {company}, Title: {title}")
    else:
        print("No table found")
        
if __name__ == "__main__":
    scrape_dart()
