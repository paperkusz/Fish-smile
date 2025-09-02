# syntax=docker/dockerfile:1
FROM python:3.11-slim AS api

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps for healthcheck tooling
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first for better caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py ./

# Runtime configuration
ENV PORT=5050 \
    DEBUG=false \
    GUNICORN_WORKERS=2

EXPOSE 5050

# Use Gunicorn for production serving
CMD ["sh", "-c", "gunicorn -w ${GUNICORN_WORKERS} -k gthread -b 0.0.0.0:${PORT} app:app"]
