# Backend AWS Deployment Rule

- **AWS Deployment**: Whenever changes are made to the Java backend (`dashboard-app`) or Python backend (`python-worker`), you must automatically deploy these changes to the AWS server without waiting for the user to ask.
- **How to Deploy**: 
  - The deployment procedure is documented in `deploy_tool.py` (specifically the `backend_deploy` method).
  - You should execute a command sequence equivalent to building the Java jar (`.\gradlew.bat bootJar`), securely copying (`scp`) the jar and **all** modified python files (`*.py`) to the AWS server (`ubuntu@13.124.135.106`), and then restarting the processes via `ssh`.
  - Always make sure you kill the old java and python processes before starting new ones in the background (`nohup`).
- **Do not commit to Git**: Backend code should generally be deployed directly to AWS. Do not push backend code to Git unless explicitly asked.
