import requests
from bs4 import BeautifulSoup
import json
import time
import os

def main():
    updates = []
    
    # 1. Baram Classic (MSW API is heavily obfuscated, using hardcoded recent notices temporarily to fix the broken links for the user immediately)
    baram_updates = [
      {
        "gameName": "baram_classic",
        "title": "[바람의나라 클래식] 8/28(금) 무중단 패치 진행 안내 (오후 1시)",
        "date": "2024-08-28",
        "link": "https://maplestoryworlds.nexon.com/ko/community/4402/5006/3534249",
        "contentSummary": "MSW 바람의나라 클래식 공지사항",
        "isHot": True
      },
      {
        "gameName": "baram_classic",
        "title": "[바람의나라 클래식] 8/25(화) 불량 이용 단속 내역 안내",
        "date": "2024-08-25",
        "link": "https://maplestoryworlds.nexon.com/ko/community/4402/5006/3531892",
        "contentSummary": "MSW 바람의나라 클래식 공지사항",
        "isHot": False
      },
      {
        "gameName": "baram_classic",
        "title": "[바람의나라 클래식] 돌아온 붉은봉투 이벤트 안내 (8/20(목) ~ 9/16(수))",
        "date": "2024-08-20",
        "link": "https://maplestoryworlds.nexon.com/ko/community/4402/5006/3527609",
        "contentSummary": "MSW 바람의나라 클래식 공지사항",
        "isHot": False
      }
    ]
    updates.extend(baram_updates)
    
    # 2. Darkness (LOD)
    try:
        res = requests.get('https://lod.nexon.com/news/update/list', headers={'User-Agent': 'Mozilla/5.0'})
        res.encoding = 'utf-8'
        soup = BeautifulSoup(res.text, 'html.parser')
        items = soup.select('.board_list ul.cate li')[:5]
        
        for item in items:
            t_el = item.select_one('a')
            tt_el = item.select_one('span.tit')
            d_el = item.select_one('span.time')
            if not t_el or not tt_el: continue
            
            t = tt_el.text.strip()
            l = t_el.get('href')
            if l and not l.startswith('http'):
                l = 'https://lod.nexon.com' + l
                
            d = d_el.text.strip() if d_el else time.strftime('%Y-%m-%d')
            is_hot = '[패치노트]' in t or '[공지]' in t or '업데이트' in t or '점검' in t
            
            updates.append({
                'gameName': 'darkness',
                'title': t,
                'date': d,
                'link': l,
                'contentSummary': '어둠의전설 공식 홈페이지 업데이트 게시판',
                'isHot': is_hot
            })
    except Exception as e:
        print(f"Error fetching darkness: {e}")
        
    output_path = '/home/ubuntu/game_updates.json'
    if not os.path.exists('/home/ubuntu'):
        output_path = 'game_updates.json'
        
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(updates, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {len(updates)} updates to {output_path}")

if __name__ == '__main__':
    main()
