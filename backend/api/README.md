# Portfolio Backend API

Live backend powering portfolio features — runs on personal Ubuntu VM (`api.manpreetsingh.co.in`).

## Quick Deploy

```bash
ssh root@<VM_IP>
git clone <repo> && cd backend/api
chmod +x deploy.sh

# Without domain (HTTP only):
./deploy.sh

# With domain (auto-SSL):
./deploy.sh api.manpreetsingh.co.in
```

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/system/metrics` | GET | Live CPU, RAM, disk, network stats |
| `/api/v1/system/health` | GET | Health check |
| `/api/v1/ai/sentiment` | POST | Text sentiment analysis |
| `/api/v1/ai/keywords` | POST | Keyword extraction |
| `/api/v1/ai/summarize` | POST | Extractive summarization |
| `/api/v1/playground/hash` | POST | Hash text (MD5/SHA) |
| `/api/v1/playground/base64` | POST | Base64 encode/decode |
| `/api/v1/playground/headers` | GET | View request headers |
| `/api/v1/playground/ip` | GET | Get client IP |
| `/api/v1/playground/json-to-csv` | POST | JSON → CSV conversion |
| `/api/v1/playground/regex-test` | POST | Test regex patterns |
| `/api/v1/contact` | POST | Contact form submission (SQLite) |
| `/api/v1/contact/messages` | GET | List contact form messages |

## CI/CD

Backend is auto-deployed via GitHub Actions when files in `backend/api/` are changed on `main`.
The workflow SSHes into the VM, copies updated files, installs any new dependencies, and restarts the service.

See `.github/workflows/deploy-backend.yml` for the pipeline configuration.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VM_SSH_KEY` | SSH private key for the VM |
| `VM_HOST` | VM IP address (e.g. `134.209.157.0`) |

## Management

```bash
# Service control
systemctl status portfolio-api
systemctl restart portfolio-api

# View logs
journalctl -u portfolio-api -f

# Check contact messages
curl https://api.manpreetsingh.co.in/api/v1/contact/messages

# API docs
https://api.manpreetsingh.co.in/docs
```

## Stack
- **FastAPI** + Uvicorn (2 workers)
- **Python 3.11** with venv
- **SQLite** for contact form storage
- **Nginx** reverse proxy with Let's Encrypt SSL
- **systemd** service with auto-restart
- **Ubuntu 22.04 LTS** on DigitalOcean
