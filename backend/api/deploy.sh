#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Portfolio API — Automated Deployment Script
#  Target: ubuntu-s-2vcpu-4gb-blr1-01 (Ubuntu 22.04 LTS)
#
#  Usage:
#    1. SSH into your VM:  ssh root@<VM_IP>
#    2. Clone/copy the vm-backend folder
#    3. chmod +x deploy.sh && ./deploy.sh
#
#  What this does:
#    - Installs Python 3.11, pip, nginx, certbot
#    - Creates a venv and installs dependencies
#    - Sets up systemd service for auto-restart
#    - Configures nginx as reverse proxy
#    - (Optionally) configures HTTPS with Let's Encrypt
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

# ── Config ──
APP_NAME="portfolio-api"
APP_DIR="/opt/portfolio-api"
APP_USER="portfolio"
DOMAIN="${1:-}"  # Pass domain as first arg, e.g. ./deploy.sh api.manpreetsingh.dev

echo "╔══════════════════════════════════════════════╗"
echo "║   Portfolio API — Deployment Script          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. System packages ──
echo "→ Updating system packages..."
apt-get update -qq
apt-get install -y -qq python3.11 python3.11-venv python3-pip nginx certbot python3-certbot-nginx ufw > /dev/null

# ── 2. Firewall ──
echo "→ Configuring firewall..."
ufw allow 22/tcp > /dev/null 2>&1 || true
ufw allow 80/tcp > /dev/null 2>&1 || true
ufw allow 443/tcp > /dev/null 2>&1 || true
ufw --force enable > /dev/null 2>&1 || true

# ── 3. Create app user ──
echo "→ Setting up app user..."
if ! id "$APP_USER" &>/dev/null; then
    useradd --system --home "$APP_DIR" --shell /bin/false "$APP_USER"
fi

# ── 4. Deploy code ──
echo "→ Deploying application to $APP_DIR..."
mkdir -p "$APP_DIR"
cp main.py "$APP_DIR/"
cp requirements.txt "$APP_DIR/"

# ── 5. Virtual environment ──
echo "→ Creating virtual environment..."
python3.11 -m venv "$APP_DIR/venv"
source "$APP_DIR/venv/bin/activate"
pip install --quiet --upgrade pip
pip install --quiet -r "$APP_DIR/requirements.txt"

# Download NLTK data
python -c "
import nltk
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('stopwords', quiet=True)
" 2>/dev/null || true

deactivate

chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

# ── 6. Systemd service ──
echo "→ Creating systemd service..."
cat > /etc/systemd/system/${APP_NAME}.service << EOF
[Unit]
Description=Portfolio API (FastAPI + Uvicorn)
After=network.target

[Service]
Type=exec
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}
ExecStart=${APP_DIR}/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5
Environment="PYTHONUNBUFFERED=1"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "${APP_NAME}" > /dev/null 2>&1
systemctl restart "${APP_NAME}"

echo "→ API service started on port 8000"

# ── 7. Nginx reverse proxy ──
echo "→ Configuring nginx..."

NGINX_DOMAIN="${DOMAIN:-_}"

cat > /etc/nginx/sites-available/${APP_NAME} << EOF
server {
    listen 80;
    server_name ${NGINX_DOMAIN};

    # Security headers
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo "→ Nginx configured"

# ── 8. SSL (optional) ──
if [ -n "$DOMAIN" ]; then
    echo "→ Setting up SSL with Let's Encrypt for $DOMAIN..."
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@${DOMAIN} --redirect || {
        echo "⚠ SSL setup failed — you can run this later:"
        echo "  certbot --nginx -d $DOMAIN"
    }
fi

# ── Done ──
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✓ Deployment Complete!                     ║"
echo "╠══════════════════════════════════════════════╣"
echo "║ API:      http://${DOMAIN:-<VM_IP>}          "
echo "║ Docs:     http://${DOMAIN:-<VM_IP>}/docs     "
echo "║ Service:  systemctl status ${APP_NAME}       "
echo "║ Logs:     journalctl -u ${APP_NAME} -f       "
echo "╚══════════════════════════════════════════════╝"
