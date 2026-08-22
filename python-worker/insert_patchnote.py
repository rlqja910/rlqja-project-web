import psycopg2
from datetime import datetime

conn = psycopg2.connect('postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require')
cur = conn.cursor()

version = 'v1.4.2'
content = '''[기능 업데이트]
- 대시보드 상단의 메인 소개 문구를 "실시간 글로벌 금융 데이터부터 AI 심층 분석까지, 당신의 투자를 한 차원 끌어올립니다."로 세련되고 직관적으로 개편했습니다.

[UI/UX 개선 및 버그 수정]
- '글로벌 위험자산 투심(Fear & Greed Index)' UI의 크기를 줄여 공간 효율을 높이고, 가독성 높은 디자인으로 전면 최적화했습니다.
- 원/달러 환율(USDKRW) 등 24시간 거래 종목이 특정 시간(미국장 16시)에 0%로 초기화되어 표기되던 캐시 버그를 완벽히 수정하여, 정상적인 전일 대비 변동률(%)이 실시간 노출되도록 개선했습니다.'''

cur.execute("INSERT INTO patch_notes (version, content, created_at) VALUES (%s, %s, NOW() AT TIME ZONE 'Asia/Seoul')", (version, content))
conn.commit()

print('Patch note inserted successfully')
cur.close(); conn.close()
