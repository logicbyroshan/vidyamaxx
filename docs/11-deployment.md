# 11 — Deployment

## Environments

| Environment | Branch | Purpose |
|-------------|--------|---------|
| `development` | local | Developer machines |
| `staging` | `develop` | QA and testing |
| `production` | `main` | Live users |

## Local Development

### Prerequisites
- Python 3.13
- Node.js 20+
- pnpm 9+
- Docker Desktop

### Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/vidyafloww.git
cd vidyafloww

# 2. Install frontend dependencies
pnpm install

# 3. Start infrastructure (PostgreSQL + Redis)
docker compose -f docker/docker-compose.yml up postgres redis -d

# 4. Setup backend
cd apps/backend
poetry install
cp ../../.env.example ../../.env
poetry run python manage.py migrate
poetry run python manage.py runserver

# 5. Start frontend
cd ../web
pnpm dev

# 6. Start Celery (in separate terminal)
cd apps/backend
poetry run celery -A config.celery worker --loglevel=info
```

### Full Docker Stack

```bash
# Start everything
docker compose -f docker/docker-compose.yml up

# Watch logs
docker compose -f docker/docker-compose.yml logs -f backend

# Run migrations inside container
docker compose exec backend python manage.py migrate
```

## Production Deployment

> TODO: Document specific deployment target when infrastructure is decided.

Planned deployment targets:
- **Backend**: AWS ECS (Fargate) or GCP Cloud Run
- **Database**: AWS RDS PostgreSQL / GCP Cloud SQL
- **Redis**: AWS ElastiCache / GCP Memorystore
- **Static/Media**: AWS S3 + CloudFront
- **Web**: Vercel / CloudFront + S3
- **Mobile**: App Store + Google Play (EAS Build)

## Environment Variables

Copy `.env.example` to `.env` and fill in all required values.
See `.env.example` for full documentation of each variable.

**Never commit `.env` files.** Use GitHub Secrets for CI/CD.

## Health Checks

- Backend: `GET /api/v1/health/` → `{ "status": "ok" }`
- Database: `pg_isready` command in Docker healthcheck
- Redis: `redis-cli ping` in Docker healthcheck

> TODO: Implement `/api/v1/health/` endpoint in `config.urls`.

## Zero-Downtime Deploys

> TODO: Document rolling deploy strategy once hosting is decided.

Strategy: Blue-green deployment with database migration compatibility requirements:
1. All migrations must be backward-compatible
2. Deploy new code alongside old code
3. Run migrations
4. Switch traffic
5. Remove old deployment

---

*Last updated: 2026-07-02*
