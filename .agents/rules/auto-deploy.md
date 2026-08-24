# Auto Deployment Rule

이 룰은 사용자가 코드를 유지보수하거나 새로운 기능을 추가한 후, 별도의 지시가 없더라도 요건이 충족되면 에이전트가 알아서 변경 사항을 배포(반영)하도록 강제합니다.

## 규칙 (Rules)
- **코드 변경 시 자동 커밋 및 푸시**: 프론트엔드(React), 백엔드(Spring Boot), 또는 Python 워커 등 소스 코드를 수정하거나 기능을 추가한 후, 작업이 성공적으로 완료되었다고 판단되면 즉시 `git add`, `git commit -m "..."`, `git push origin main` 명령어를 백그라운드 작업으로 실행하세요.
- **Python 워커 서버 자동 반영 (AWS)**: `python-worker/main.py` 등 파이썬 관련 코드가 수정된 경우, 깃 푸시와 함께 다음의 자동 배포 명령어를 통해 AWS Lightsail 서버에 변경 사항을 반영하세요.
  `scp -i key.pem -o StrictHostKeyChecking=no python-worker/main.py ubuntu@13.124.135.106:/home/ubuntu/python-worker/main.py && ssh -i key.pem -o StrictHostKeyChecking=no ubuntu@13.124.135.106 "sudo fuser -k 8000/tcp; cd /home/ubuntu/python-worker && source venv/bin/activate && nohup uvicorn main:app --host 0.0.0.0 --port 8000 </dev/null > worker.log 2>&1 &"`
- **프론트엔드 반영 (Vercel)**: 프론트엔드(src, views 등) 변경 시 Vercel이 깃허브 `main` 브랜치 변경을 감지하여 자동 배포하므로 깃 커밋 및 푸시만 확실히 진행하세요.
- **백엔드 반영 (Spring Boot)**: 백단(Java) 코드가 변경된 경우, `deploy_tool.py` 에 정의된 빌드 및 배포 절차를 참고하여 jar 파일 빌드 후 SCP 전송, 프로세스 킬 및 재시작(`nohup java ...`) 명령어를 실행하세요.
- 사용자가 "반영하지 마라"고 명시하지 않는 이상, 코딩 턴이 끝날 때 마무리 작업으로 커밋+푸시+배포 스크립트를 항상 실행할 것.
