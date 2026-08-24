# Auto Patch Notes Rule

이 규칙은 Antigravity AI(코딩 어시스턴트)가 개발 작업을 수행할 때 반드시 지켜야 하는 '패치노트 자동화 규칙'입니다.

사용자는 새로운 기능이나 버그 수정이 완료될 때마다 별도로 지시하지 않아도 패치노트가 자동으로 DB에 주입되기를 원합니다.
앞으로 당신(AI)은 유의미한 코드 작업을 완료할 때마다, 사용자에게 보고하기 직전에 반드시 'run_command' 툴을 사용하여 아래 PowerShell 명령어로 패치노트를 DB에 직접 주입하세요.

명령어 예시:
$body = @{ version="v1.0.X"; content="🚀 새로운 기능..." } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/patch-notes -Method POST -Body $body -ContentType "application/json; charset=utf-8"

이 규칙을 통해 패치노트 작성이 100% 자동화된 것처럼 작동해야 합니다.
