# Deployment Guide — Staging

## Topology
- **Web Portal (`apps/web`)**: Static Nginx build (`docker/Dockerfile.web`) served over HTTPS.
- **API & WebSockets (`apps/backend`)**: Gunicorn + Uvicorn workers (`docker/Dockerfile.backend` target `production`).
- **Workers**: Dedicated Celery worker + single Celery Beat instance connected to managed PostgreSQL 16 and Redis 7.
- **Storage**: Dedicated staging S3 bucket with private ACLs and CORS restricted to staging origins.

## Pre-Deploy Checklist
1. Execute `python manage.py migrate --plan` and verify backward-compatible migrations.
2. Verify `DEBUG=False`, `CORS_ALLOWED_ORIGINS` strictly locked to staging subdomains, and Sentry DSN active.
3. Run `GET /api/v1/health/` smoke verification after rollout.
