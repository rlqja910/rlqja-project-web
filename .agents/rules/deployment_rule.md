---
name: Frontend-Only Deployment Rule
description: Rules for git commits and deployments when the user asks to push or deploy
---

# Deployment & Git Commit Rules

- **프론트엔드 전용 커밋/배포**: 사용자가 단순히 "커밋하고 배포해라" 또는 "frontend-app 배포해라" 라고 요청할 때, 절대 `dashboard-app`(스프링부트 백엔드)나 `python-worker`의 변경사항을 함께 `git add` 하거나 커밋하지 마세요.
- 오직 `frontend-app` 디렉터리의 변경사항만 커밋 및 푸쉬해야 합니다. (예: `git add frontend-app`)
- 백엔드(dashboard-app, python-worker) 코드의 EC2 배포나 깃 커밋은 사용자가 명시적으로 백엔드도 배포하라고 지시했을 때만 수행하세요.
