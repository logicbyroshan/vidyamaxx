# Deployment Guide — Production (India-First SaaS)

## Security & Sovereignty Controls
- **Data Residency**: Host PostgreSQL, Redis, and S3 buckets in AWS `ap-south-1` (Mumbai) or MeitY-empaneled Indian regions.
- **Transport & Secrets**: TLS 1.3 at Load Balancer/Nginx; `SECURE_SSL_REDIRECT=True`, `HSTS=31536000s`, HTTP-only secure refresh cookies. Secrets injected via cloud Secrets Manager / KMS — never committed `.env` files.
- **Database High Availability**: Managed PostgreSQL 16+ with Multi-AZ failover, automated daily PITR backups (35-day retention), and PgBouncer transaction pooling.
- **Zero-Downtime Rollout**:
  1. Verify all new migrations are additive/backward-compatible before deploying new containers.
  2. Run `python manage.py migrate --noinput` as an atomic pre-release hook.
  3. Blue/green swap backend API & Celery workers; purge CDN if static assets changed.
  4. Monitor `/api/v1/health/`, Sentry error rates, and Celery queue depth; keep previous container image ready for instant rollback.
