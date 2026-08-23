import psycopg2

conn = psycopg2.connect('postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require')
cur = conn.cursor()

version = "v1.4.1"
content = """[시스템 코어 및 알림 기능 대규모 업데이트]

1. 타겟팅 푸시 알림 기능 도입 🎯
- 이제 전체 유저뿐만 아니라, 특정 방문자(Visitor ID)를 선택하여 개별적으로 푸시 알림을 발송할 수 있습니다.
- 알림 구독 시 사용자 이름을 입력받아, "OOO님~" 형태로 개인화된 푸시 메시지를 발송하도록 고도화되었습니다.
- 알림 수락/거절 정책 개선: 알림을 거절하더라도 3일 후 다시 안내 팝업이 노출되도록 개선되었습니다. (거부감 없는 차분한 안내 문구 적용)

2. 글로벌 시간대(Timezone) 동기화 완벽 해결 ⏰
- 백엔드(JVM), 데이터베이스 드라이버(JDBC), 프론트엔드 간의 시간대 오차(9시간 밀림/당겨짐 현상)를 원천 차단했습니다.
- 시스템 전체가 한국 표준시(KST)를 기준으로 동작하며, 접속 로그(Access Logs), 푸시 이력, 리포트 발행 등 모든 기록이 1초의 오차도 없이 한국 시간으로 영구 저장 및 표시됩니다.
- 기존에 꼬여있던 과거 로그 기록들까지 모두 정상적인 KST 기준으로 복구(소급 적용) 완료했습니다.

3. 관리자(CRM) 대시보드 강화 🛠️
- 타겟 유저 검색 및 다중 선택 발송 기능(CRM UI) 추가
- 과거 푸시 발송 이력(Push Logs) 조회 기능 추가 (발송 타겟 수, 수신자 ID 리스트, 성공/실패 건수 로깅)
- 테스트 편의성을 위한 '내 기기 캐시/서비스워커 강제 초기화' 버튼 추가"""

try:
    cur.execute("INSERT INTO patch_notes (version, content, created_at) VALUES (%s, %s, now() AT TIME ZONE 'Asia/Seoul');", (version, content))
    conn.commit()
    print("Patch note inserted successfully!")
except Exception as e:
    print("Error:", e)
    conn.rollback()

cur.close()
conn.close()
