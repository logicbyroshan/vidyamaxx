# Deployment Guide — Local Development

## Prerequisites
- Python 3.11+ (or 3.13 via Docker)
- PostgreSQL 16/17 (`postgresql-x64-17` locally) & Redis 7
- Node.js 20+, `pnpm@9.0.0`

## Setup Steps
1. **Start Infrastructure Services**:
   - Local Windows PostgreSQL: `Start-Service postgresql-x64-17` (or via Docker: `docker compose -f docker/docker-compose.yml up postgres redis -d`).
   - Create `vidyafloww_db` and `vidyafloww_test` with UTF-8 encoding and user `vidyafloww`.
2. **Environment Configuration**:
   - Ensure root `.env` defines PostgreSQL, Redis, `DJANGO_SECRET_KEY`, and `USE_SQLITE=false` when testing PostgreSQL locally. Never commit `.env`.
3. **Install Backend Dependencies**:
   ```bash
   cd apps/backend
   .venv\Scripts\python -m pip install -r requirements.txt
   ```
4. **Apply Migrations & Run Server**:
   ```bash
   python apps/backend/manage.py migrate
   python apps/backend/manage.py runserver 0.0.0.0:8000
   ```
5. **Start Celery Worker & Web Portal**:
   ```bash
   celery -A config.celery worker --loglevel=info
   pnpm --filter @vidyafloww/web dev
   ```
