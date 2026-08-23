DELETE FROM patch_note WHERE id = 5; INSERT INTO patch_note (version, content, created_at) VALUES ('v1.0.5', '📊 **방문자 통계(Access Log) 시스템 구축**

- 🕵️ **고유 방문자 추적:** IP를 기준으로 오늘 방문자 수 및 총 방문자 수를 추적하는 백엔드 로직 추가
- 🏷️ **대시보드 통계 뱃지:** 화면 우측 상단에 실시간 통계 현황을 보여주는 UI 업데이트', NOW());
