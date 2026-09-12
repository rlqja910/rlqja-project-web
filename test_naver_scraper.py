import requests
from bs4 import BeautifulSoup
import urllib.parse

def scrape_naver():
    query = urllib.parse.quote("자기주식취득결정")
    url = f"https://finance.naver.com/news/news_search.naver?q={query}&sm=title.basic"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    news_list = soup.find('div', class_='newsSchResult')
    if news_list:
        articles = news_list.find_all('dl', class_='newsList')
        print(f"Found {len(articles)} articles!")
        for article in articles[:10]:
            title_tag = article.find('dd', class_='articleSubject')
            if title_tag:
                title = title_tag.text.strip()
                print(title)
    else:
        print("No news found")

if __name__ == "__main__":
    scrape_naver()
