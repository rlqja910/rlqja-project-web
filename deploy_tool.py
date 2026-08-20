import tkinter as tk
from tkinter import messagebox, scrolledtext
import subprocess
import threading
import os

PROJECT_DIR = r"c:\Users\ssongarr\Desktop\project"

def run_command_in_bg(cmd_name, cmd_list, text_widget, cwd=PROJECT_DIR):
    def target():
        text_widget.insert(tk.END, f"\n[{cmd_name}] 시작...\n")
        text_widget.insert(tk.END, f"> {cmd_list}\n")
        text_widget.see(tk.END)
        try:
            # Use shell=True for windows commands
            process = subprocess.Popen(
                cmd_list,
                cwd=cwd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding='utf-8',
                errors='replace'
            )
            for line in process.stdout:
                text_widget.insert(tk.END, line)
                text_widget.see(tk.END)
            
            process.wait()
            if process.returncode == 0:
                text_widget.insert(tk.END, f"\n[{cmd_name}] ✅ 성공적으로 완료되었습니다!\n")
            else:
                text_widget.insert(tk.END, f"\n[{cmd_name}] ❌ 오류 발생 (종료 코드: {process.returncode})\n")
        except Exception as e:
            text_widget.insert(tk.END, f"\n[{cmd_name}] ❌ 예외 발생: {str(e)}\n")
        text_widget.see(tk.END)

    threading.Thread(target=target, daemon=True).start()


class DeployApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("KoreKore Deploy Automation")
        self.geometry("700x500")
        self.configure(padx=20, pady=20)

        # Title
        title_label = tk.Label(self, text="🚀 KoreKore Deploy Manager", font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 20))

        # Buttons Frame
        btn_frame = tk.Frame(self)
        btn_frame.pack(fill=tk.X, pady=(0, 20))

        btn1 = tk.Button(btn_frame, text="1. 깃 커밋&푸쉬 (프론트엔드)", width=25, height=2, bg="#e2e8f0", command=self.git_push)
        btn1.pack(side=tk.LEFT, padx=5, expand=True)

        btn2 = tk.Button(btn_frame, text="2. 화면 배포 (Vercel 배포 트리거)", width=25, height=2, bg="#bae6fd", command=self.frontend_deploy)
        btn2.pack(side=tk.LEFT, padx=5, expand=True)

        btn3 = tk.Button(btn_frame, text="3. 백단 배포 (AWS 전체 배포)", width=25, height=2, bg="#fed7aa", command=self.backend_deploy)
        btn3.pack(side=tk.LEFT, padx=5, expand=True)

        # Console Output
        tk.Label(self, text="실행 로그:", font=("Arial", 10, "bold")).pack(anchor=tk.W)
        self.console = scrolledtext.ScrolledText(self, bg="#1e293b", fg="#e2e8f0", font=("Consolas", 10))
        self.console.pack(fill=tk.BOTH, expand=True)

    def git_push(self):
        # 깃허브에는 frontend-app과 vercel.json만 추가
        cmd = 'git add frontend-app vercel.json && git commit -m "auto: frontend update" && git push origin main'
        run_command_in_bg("Git 커밋&푸쉬", cmd, self.console)

    def frontend_deploy(self):
        self.console.insert(tk.END, "\n[화면 배포] Vercel은 '깃 커밋&푸쉬' 시 자동으로 배포됩니다!\n만약 Vercel CLI가 설치되어 있다면 강제 배포를 시도합니다.\n")
        cmd = 'vercel --prod --yes'
        run_command_in_bg("화면 배포(Vercel)", cmd, self.console)

    def backend_deploy(self):
        # 백단 배포: 빌드 -> scp 복사 -> ssh 재시작 (Spring Boot + Python)
        cmd = (
            "cd dashboard-app && "
            ".\\gradlew.bat bootJar && "
            "scp -i ..\\key.pem -o StrictHostKeyChecking=no build\\libs\\demo-0.0.1-SNAPSHOT.jar ubuntu@13.124.135.106:/home/ubuntu/demo.jar && "
            "scp -i ..\\key.pem -o StrictHostKeyChecking=no ..\\python-worker\\main.py ubuntu@13.124.135.106:/home/ubuntu/python-worker/main.py && "
            "ssh -i ..\\key.pem -o StrictHostKeyChecking=no ubuntu@13.124.135.106 \"sudo pkill -9 java; sudo fuser -k 8000/tcp; nohup java -Djava.security.egd=file:/dev/./urandom -Xmx256m -jar /home/ubuntu/demo.jar </dev/null > /home/ubuntu/java.log 2>&1 & cd /home/ubuntu/python-worker && source venv/bin/activate && nohup uvicorn main:app --host 0.0.0.0 --port 8000 </dev/null > worker.log 2>&1 &\""
        )
        run_command_in_bg("백단 배포(AWS)", cmd, self.console)


if __name__ == "__main__":
    app = DeployApp()
    app.mainloop()
