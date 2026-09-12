import psycopg2

conn = psycopg2.connect('postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require')
cur = conn.cursor()

# Remove the broken patch note if it was inserted via PowerShell (v1.5.1)
cur.execute("DELETE FROM patch_notes WHERE version = 'v1.5.1';")
conn.commit()

version = "v1.5.1"
content = """[인구신 AI 스캐너 UI 및 버그 패치]

🤖 **인구신 명언 및 조회수 버그 수정**
- 스캐너 메인 화면에 찰진 명언이 추가되었습니다. (인구는 신이다...)
- 리포트 조회수 시스템 오류 수정: 페이지 새로고침 시 조회수가 고무줄처럼 왔다갔다 하던 버그를 수정했습니다. 
- 이제 백엔드와 프론트엔드의 24시간 중복 방지 로직이 완벽하게 동기화되어 정상 작동합니다."""

try:
    cur.execute("INSERT INTO patch_notes (version, content, created_at) VALUES (%s, %s, now() AT TIME ZONE 'Asia/Seoul');", (version, content))
    conn.commit()
    print("Patch note inserted successfully!")
except Exception as e:
    print("Error:", e)
    conn.rollback()

cur.close()
conn.close()
