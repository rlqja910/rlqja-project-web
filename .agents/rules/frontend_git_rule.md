# Frontend Git Rule

- **The frontend code is located at the ROOT of the repository.** (`/src`, `/public`, `/package.json`, etc.)
- **DO NOT** create, modify, or commit anything into a `frontend-app` folder. It has been deleted because Vercel expects the code at the root.
- **ONLY** commit and push the frontend-related files located at the root when doing frontend work.
- **DO NOT** commit or push any changes from Python (`python-worker`) or Java (`dashboard-app`) or any root-level backend files when deploying the frontend to Vercel.
- When the frontend screen or logic is updated, make sure to automatically commit and push the frontend changes without asking, as long as they are verified.
