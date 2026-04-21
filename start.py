import subprocess
import time
import sys
import os
import signal
import re

def kill_process_on_port(port):
    """Kills any process running on the specified port (Windows only)."""
    if os.name != 'nt':
        return
    
    try:
        # Find PID using netstat
        cmd = f"netstat -ano | findstr :{port}"
        output = subprocess.check_output(cmd, shell=True).decode()
        pids = set(re.findall(r'\s+(\d+)\s*$', output, re.MULTILINE))
        
        for pid in pids:
            if pid != '0':
                print(f"⚠️ Port {port} band ekan. PID {pid} o'chirilmoqda...")
                subprocess.call(['taskkill', '/F', '/T', '/PID', pid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        # Port is likely free
        pass

def run_servers():
    print("\n" + "="*50)
    print("🚀 Raqamli Kutubxona - Robust Startup v2.0")
    print("="*50 + "\n")

    # Step 1: Cleanup ports
    kill_process_on_port(8000)
    kill_process_on_port(3000)

    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    # Start Backend
    print("📂 Starting Backend (Django) on http://localhost:8000...")
    backend_process = subprocess.Popen(
        [sys.executable, "manage.py", "runserver", "8000"],
        cwd=backend_dir,
        # On Windows, we need to show the console or it might block
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
    )

    # Start Frontend
    print("📂 Starting Frontend (Next.js) on http://localhost:3000...")
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    frontend_process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
    )

    print("\n✅ Ikkala server ham ishga tushirildi!")
    print("👉 User Interface: http://localhost:3000")
    print("👉 Admin Panel: http://localhost:8000/admin")
    print("\n🛑 To'xtatish uchun: Ctrl+C\n")

    try:
        while True:
            time.sleep(2)
            if backend_process.poll() is not None:
                print("❌ Backend server to'xtab qoldi. Qayta ishga tushirilmoqda...")
                backend_process = subprocess.Popen([sys.executable, "manage.py", "runserver", "8000"], cwd=backend_dir)
            if frontend_process.poll() is not None:
                print("❌ Frontend server to'xtab qoldi. Qayta ishga tushirilmoqda...")
                frontend_process = subprocess.Popen([npm_cmd, "run", "dev"], cwd=frontend_dir, shell=True)
    except KeyboardInterrupt:
        print("\n⏳ Hammasi yopilmoqda...")
        if os.name == 'nt':
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(backend_process.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_process.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            backend_process.terminate()
            frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    run_servers()
