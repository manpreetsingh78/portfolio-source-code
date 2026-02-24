"""
Manpreet Singh — Portfolio Backend API
Runs on personal VM: ubuntu-s-2vcpu-4gb-blr1-01
Provides live server metrics, AI/NLP inference, and API playground endpoints.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import psutil
import platform
import time
import hashlib
import base64
import re
import json
from datetime import datetime, timezone
from collections import Counter
from typing import Literal


# ─────────────────────────── App Setup ───────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Download NLP data on startup."""
    try:
        import nltk
        nltk.download("punkt", quiet=True)
        nltk.download("punkt_tab", quiet=True)
        nltk.download("averaged_perceptron_tagger", quiet=True)
        nltk.download("stopwords", quiet=True)
    except Exception:
        pass
    yield


app = FastAPI(
    title="Manpreet Singh — Portfolio API",
    description=(
        "Live backend powering portfolio features. "
        "Real-time server metrics, AI/NLP inference, and developer utilities."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://manpreetsingh.dev",   # ← update with real domain
        "https://www.manpreetsingh.dev",
        "http://134.209.157.0",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────── Shared Models ───────────────────────────

class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Input text to analyze")


class HashInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    algorithm: Literal["md5", "sha1", "sha256", "sha512"] = "sha256"


class Base64Input(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    action: Literal["encode", "decode"] = "encode"


class JSONToCSVInput(BaseModel):
    data: list[dict] = Field(..., min_length=1, max_length=100)


# ─────────────────────────── SYSTEM METRICS ───────────────────────────

@app.get("/api/v1/system/health", tags=["System"])
def health_check():
    """Simple health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }


@app.get("/api/v1/system/metrics", tags=["System"])
def system_metrics():
    """
    Real-time server metrics: CPU, memory, disk, network, uptime.
    Polled live from the Ubuntu VM.
    """
    cpu = psutil.cpu_percent(interval=0.5)
    cpu_freq = psutil.cpu_freq()
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()
    boot = psutil.boot_time()
    uptime = int(time.time() - boot)
    load = psutil.getloadavg()

    return {
        "cpu": {
            "percent": cpu,
            "cores": psutil.cpu_count(logical=True),
            "freq_mhz": round(cpu_freq.current, 0) if cpu_freq else None,
        },
        "memory": {
            "total_gb": round(mem.total / (1024**3), 2),
            "used_gb": round(mem.used / (1024**3), 2),
            "percent": mem.percent,
        },
        "disk": {
            "total_gb": round(disk.total / (1024**3), 2),
            "used_gb": round(disk.used / (1024**3), 2),
            "percent": round(disk.percent, 1),
        },
        "network": {
            "bytes_sent_mb": round(net.bytes_sent / (1024**2), 2),
            "bytes_recv_mb": round(net.bytes_recv / (1024**2), 2),
        },
        "uptime_seconds": uptime,
        "load_average": {
            "1m": round(load[0], 2),
            "5m": round(load[1], 2),
            "15m": round(load[2], 2),
        },
        "platform": platform.platform(),
        "hostname": platform.node(),
        "python_version": platform.python_version(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ─────────────────────────── AI / NLP ───────────────────────────

STOP_WORDS = {
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "has", "have", "been", "will", "more",
    "when", "who", "than", "them", "what", "their", "which", "this", "that",
    "with", "from", "they", "some", "also", "into", "just", "only", "very",
    "about", "would", "could", "should", "there", "where", "does", "other",
    "each", "then", "these", "those", "such", "most", "your", "its", "any",
    "how", "may", "too", "being", "through", "over", "between",
}


@app.post("/api/v1/ai/sentiment", tags=["AI"])
def analyze_sentiment(input: TextInput):
    """
    Analyze sentiment of text using TextBlob NLP.
    Returns polarity (-1 to 1), subjectivity (0 to 1), and label.
    """
    from textblob import TextBlob

    blob = TextBlob(input.text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    if polarity > 0.1:
        label = "positive"
        emoji = "😊"
    elif polarity < -0.1:
        label = "negative"
        emoji = "😞"
    else:
        label = "neutral"
        emoji = "😐"

    return {
        "label": label,
        "emoji": emoji,
        "polarity": round(polarity, 4),
        "subjectivity": round(subjectivity, 4),
        "confidence": round(min(abs(polarity) * 2, 1.0), 4),
        "word_count": len(input.text.split()),
    }


@app.post("/api/v1/ai/keywords", tags=["AI"])
def extract_keywords(input: TextInput):
    """
    Extract keywords using TF-based scoring with stop-word filtering.
    Returns the top 10 keywords ranked by frequency.
    """
    words = re.findall(r"\b[a-zA-Z]{3,}\b", input.text.lower())
    filtered = [w for w in words if w not in STOP_WORDS]

    if not filtered:
        return {"keywords": [], "total_words": len(words), "unique_words": 0}

    freq = Counter(filtered)
    top = freq.most_common(10)
    max_count = top[0][1] if top else 1

    return {
        "keywords": [
            {"word": w, "count": c, "relevance": round(c / max_count, 4)}
            for w, c in top
        ],
        "total_words": len(words),
        "unique_words": len(set(filtered)),
    }


@app.post("/api/v1/ai/summarize", tags=["AI"])
def summarize_text(input: TextInput):
    """
    Extractive text summarization using sentence scoring.
    Selects the most informative sentences based on word frequency.
    """
    sentences = re.split(r"(?<=[.!?])\s+", input.text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 15]

    if len(sentences) <= 2:
        return {
            "summary": input.text.strip(),
            "sentences_original": len(sentences),
            "sentences_summary": len(sentences),
            "compression_ratio": 1.0,
        }

    # Score by word frequency
    words = re.findall(r"\b[a-zA-Z]{3,}\b", input.text.lower())
    freq = Counter(w for w in words if w not in STOP_WORDS)

    scored = []
    for i, s in enumerate(sentences):
        s_words = re.findall(r"\b[a-zA-Z]{3,}\b", s.lower())
        score = sum(freq.get(w, 0) for w in s_words) / max(len(s_words), 1)
        # Boost earlier sentences slightly
        score *= 1.0 + 0.1 * (1 - i / len(sentences))
        scored.append((score, s))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_n = max(1, len(sentences) // 3)
    # Preserve original order
    selected = sorted(scored[:top_n], key=lambda x: sentences.index(x[1]))
    summary = " ".join(s for _, s in selected)

    return {
        "summary": summary,
        "sentences_original": len(sentences),
        "sentences_summary": top_n,
        "compression_ratio": round(top_n / len(sentences), 2),
    }


# ─────────────────────────── PLAYGROUND ───────────────────────────

@app.post("/api/v1/playground/hash", tags=["Playground"])
def hash_text(input: HashInput):
    """Hash text with MD5, SHA-1, SHA-256, or SHA-512."""
    algos = {
        "md5": hashlib.md5,
        "sha1": hashlib.sha1,
        "sha256": hashlib.sha256,
        "sha512": hashlib.sha512,
    }
    h = algos[input.algorithm](input.text.encode()).hexdigest()
    return {
        "hash": h,
        "algorithm": input.algorithm,
        "length": len(h),
        "input_bytes": len(input.text.encode()),
    }


@app.post("/api/v1/playground/base64", tags=["Playground"])
def base64_convert(input: Base64Input):
    """Encode or decode Base64 strings."""
    if input.action == "encode":
        result = base64.b64encode(input.text.encode()).decode()
    else:
        try:
            result = base64.b64decode(input.text.encode()).decode()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 string")

    return {"result": result, "action": input.action}


@app.get("/api/v1/playground/headers", tags=["Playground"])
def get_request_headers(request: Request):
    """Returns all HTTP headers from the incoming request."""
    return {
        "headers": dict(request.headers),
        "method": request.method,
        "url": str(request.url),
    }


@app.get("/api/v1/playground/ip", tags=["Playground"])
def get_client_ip(request: Request):
    """Returns the client's IP address and request metadata."""
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else request.client.host
    return {
        "ip": ip,
        "user_agent": request.headers.get("user-agent", "Unknown"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/v1/playground/json-to-csv", tags=["Playground"])
def json_to_csv(input: JSONToCSVInput):
    """Convert a JSON array of objects to CSV format."""
    if not input.data:
        raise HTTPException(status_code=400, detail="Empty data array")

    headers = list(input.data[0].keys())
    rows = [",".join(headers)]
    for item in input.data:
        rows.append(",".join(str(item.get(h, "")) for h in headers))

    return {
        "csv": "\n".join(rows),
        "rows": len(input.data),
        "columns": len(headers),
    }


@app.post("/api/v1/playground/regex-test", tags=["Playground"])
def regex_test(pattern: str, text: str):
    """Test a regex pattern against text and return matches."""
    try:
        matches = re.findall(pattern, text)
        return {
            "pattern": pattern,
            "matches": matches[:50],
            "count": len(matches),
            "valid_pattern": True,
        }
    except re.error as e:
        return {
            "pattern": pattern,
            "matches": [],
            "count": 0,
            "valid_pattern": False,
            "error": str(e),
        }


# ─────────────────────────── Root ───────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "name": "Manpreet Singh — Portfolio API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "system": "/api/v1/system/metrics",
            "ai": ["/api/v1/ai/sentiment", "/api/v1/ai/keywords", "/api/v1/ai/summarize"],
            "playground": [
                "/api/v1/playground/hash",
                "/api/v1/playground/base64",
                "/api/v1/playground/headers",
                "/api/v1/playground/ip",
                "/api/v1/playground/json-to-csv",
            ],
        },
    }
