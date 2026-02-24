# Portfolio Backend API

Live backend powering portfolio features — runs on personal Ubuntu VM.

## Quick Deploy

```bash
ssh root@<VM_IP>
git clone <repo> && cd vm-backend
chmod +x deploy.sh

# Without domain (HTTP only):
./deploy.sh

# With domain (auto-SSL):
./deploy.sh api.manpreetsingh.dev
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

## Management

```bash
# Service control
systemctl status portfolio-api
systemctl restart portfolio-api

# View logs
journalctl -u portfolio-api -f

# Update code
cp main.py /opt/portfolio-api/
systemctl restart portfolio-api
```

## Stack
- **FastAPI** + Uvicorn (2 workers)
- **TextBlob** + NLTK for NLP
- **psutil** for system metrics
- **Nginx** reverse proxy + rate limiting
- **Let's Encrypt** SSL (optional)
