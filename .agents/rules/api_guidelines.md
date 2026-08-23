---
description: 백엔드 API 컨트롤러 작성 가이드라인 (단일 거대 파일 방지)
---

# API Controller Guidelines

1. **절대 하나의 컨트롤러(`ApiController.java` 등)에 모든 기능을 때려 박지 마세요.**
2. **도메인/메뉴/그룹 별로 컨트롤러를 분리하세요.**
   - 예: 게시물 관련은 `PostController`, 패치노트 관련은 `PatchNoteController`, 통계 관련은 `SystemLogController` 등.
3. 무조건 기능이 추가될 때마다 기존 컨트롤러가 비대해지는지 확인하고, 성격이 다르면 과감하게 새 컨트롤러 파일을 생성하세요.
4. **엔드포인트(URL)는 기존 규칙과 동일하게 가져가되, 백엔드 로직의 폴더와 파일 구조만 세분화하여 유지보수성을 극대화합니다.**
