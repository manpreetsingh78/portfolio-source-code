#!/usr/bin/env python3
"""
GitHub Webhook Receiver for Portfolio Backend Auto-Deploy.

Listens on port 9000 for GitHub push webhooks.
When backend/api/ files are changed on main, it:
  1. Pulls the latest code from GitHub
  2. Copies backend files to /opt/portfolio-api/
  3. Installs any new dependencies
  4. Restarts the service
  5. Verifies health

Secured with HMAC-SHA256 webhook secret.
"""

import hashlib
import hmac
import json
import os
import subprocess
import sys
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone

# ── Config ──
WEBHOOK_PORT = 9000
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")
APP_DIR = "/opt/portfolio-api"
REPO_URL = "https://github.com/manpreetsingh78/portfolio-source-code.git"
BRANCH = "main"
LOG_FILE = "/var/log/portfolio-deploy.log"


def log(msg: str):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except Exception:
        pass


def verify_signature(payload: bytes, signature: str) -> bool:
    """Verify GitHub HMAC-SHA256 webhook signature."""
    if not WEBHOOK_SECRET:
        log("WARNING: No WEBHOOK_SECRET set — skipping signature verification")
        return True
    if not signature or not signature.startswith("sha256="):
        return False
    expected = hmac.new(
        WEBHOOK_SECRET.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


def run_cmd(cmd: str, cwd: str = "/tmp") -> tuple[int, str]:
    """Run a shell command and return (returncode, output)."""
    result = subprocess.run(
        cmd, shell=True, cwd=cwd,
        capture_output=True, text=True, timeout=120
    )
    output = result.stdout + result.stderr
    return result.returncode, output.strip()


def deploy() -> tuple[bool, str]:
    """Pull latest code, copy backend files, restart service."""
    steps = []
    deploy_dir = "/tmp/portfolio-deploy"

    try:
        # 1. Clone latest
        log("==> Cloning latest code...")
        run_cmd(f"rm -rf {deploy_dir}")
        rc, out = run_cmd(f"git clone --depth 1 --branch {BRANCH} {REPO_URL} {deploy_dir}")
        if rc != 0:
            return False, f"Git clone failed: {out}"
        steps.append("cloned")

        # 2. Backup current
        log("==> Backing up current code...")
        run_cmd(f"cp {APP_DIR}/main.py {APP_DIR}/main.py.bak")
        steps.append("backed up")

        # 3. Copy new files
        log("==> Copying new files...")
        rc, out = run_cmd(f"cp {deploy_dir}/backend/api/main.py {APP_DIR}/main.py")
        if rc != 0:
            return False, f"Copy main.py failed: {out}"
        run_cmd(f"cp {deploy_dir}/backend/api/requirements.txt {APP_DIR}/requirements.txt")
        steps.append("copied")

        # 4. Install deps
        log("==> Installing dependencies...")
        rc, out = run_cmd(
            f"{APP_DIR}/venv/bin/pip install -q -r {APP_DIR}/requirements.txt",
            cwd=APP_DIR
        )
        if rc != 0:
            log(f"pip install warning: {out}")
        steps.append("deps installed")

        # 5. Restart
        log("==> Restarting service...")
        rc, out = run_cmd("systemctl restart portfolio-api")
        if rc != 0:
            return False, f"Restart failed: {out}"
        steps.append("restarted")

        # 6. Health check with retries
        log("==> Running health check...")
        health_ok = False
        for attempt in range(5):
            time.sleep(3)
            rc, out = run_cmd("curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/v1/system/health")
            code = out.strip().strip("'")
            if code == "200":
                health_ok = True
                break
            log(f"    Health check attempt {attempt + 1}/5: HTTP {code}")
        if not health_ok:
            # Rollback
            log(f"==> Health check failed after 5 attempts, rolling back...")
            run_cmd(f"cp {APP_DIR}/main.py.bak {APP_DIR}/main.py")
            run_cmd("systemctl restart portfolio-api")
            return False, f"Health check failed (HTTP {code}), rolled back"
        steps.append("health OK")

        # Cleanup
        run_cmd(f"rm -rf {deploy_dir}")
        run_cmd(f"rm -f {APP_DIR}/main.py.bak")

        return True, f"Deploy successful: {' → '.join(steps)}"

    except Exception as e:
        # Emergency rollback
        try:
            run_cmd(f"cp {APP_DIR}/main.py.bak {APP_DIR}/main.py")
            run_cmd("systemctl restart portfolio-api")
        except Exception:
            pass
        return False, f"Deploy error: {str(e)}"


class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/webhook":
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        payload = self.rfile.read(content_length)

        # Verify signature
        signature = self.headers.get("X-Hub-Signature-256", "")
        if not verify_signature(payload, signature):
            log("Rejected: invalid signature")
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'{"error":"invalid signature"}')
            return

        # Parse payload
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return

        # Check if it's a push to main
        event = self.headers.get("X-GitHub-Event", "")
        if event != "push":
            log(f"Ignored event: {event}")
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"ignored","reason":"not a push event"}')
            return

        ref = data.get("ref", "")
        if ref != f"refs/heads/{BRANCH}":
            log(f"Ignored push to: {ref}")
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"ignored","reason":"not main branch"}')
            return

        # Check if backend files were changed
        commits = data.get("commits", [])
        backend_changed = False
        for commit in commits:
            changed_files = (
                commit.get("added", []) +
                commit.get("modified", []) +
                commit.get("removed", [])
            )
            if any(f.startswith("backend/api/") for f in changed_files):
                backend_changed = True
                break

        if not backend_changed:
            log("Ignored push: no backend/api/ changes")
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"ignored","reason":"no backend changes"}')
            return

        # Deploy!
        log(f"==> Deploying from push by {data.get('pusher', {}).get('name', 'unknown')}...")
        success, message = deploy()
        log(message)

        status = 200 if success else 500
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success" if success else "failed",
            "message": message,
        }).encode())

    def do_GET(self):
        if self.path == "/webhook/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"healthy","service":"deploy-webhook"}')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Suppress default access logs."""
        pass


def main():
    if not WEBHOOK_SECRET:
        log("WARNING: WEBHOOK_SECRET not set. Set it for security: export WEBHOOK_SECRET=your_secret")

    server = HTTPServer(("0.0.0.0", WEBHOOK_PORT), WebhookHandler)
    log(f"Webhook listener started on port {WEBHOOK_PORT}")
    log(f"Endpoint: POST /webhook")
    log(f"Health:   GET  /webhook/health")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log("Shutting down webhook listener")
        server.server_close()


if __name__ == "__main__":
    main()
