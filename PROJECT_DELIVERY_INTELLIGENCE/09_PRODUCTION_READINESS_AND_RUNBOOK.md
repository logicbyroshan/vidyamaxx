# 09 — PRODUCTION READINESS & DEVELOPER RUNBOOK

> **Last Updated**: 2026-11-20

---

## 1. Local Full-Stack Development Quickstart

### Step 1: Start Django REST API (`http://localhost:8000`)
```powershell
cd E:\E\VidyaMaxx\VidyaMaxx\apps\backend
$env:USE_SQLITE = "true"
python manage.py migrate
python manage.py seed_foundation --dev-password "YourLocalDevPassword#2026"
python manage.py runserver 0.0.0.0:8000
```

Seeded local accounts (when `--dev-password` is supplied):
- **Admin / Principal**: `principal@vidyafloww.edu.in` (`SCHOOL_ADMIN` + `SUPER_ADMIN`)
- **Faculty / Staff**: `teacher@vidyafloww.edu.in` (`STAFF`)
- **Parent**: `parent@vidyafloww.edu.in` (`PARENT`)
- **Student**: `student@vidyafloww.edu.in` (`STUDENT`)

### Step 2: Start Main Command Portal (`http://localhost:3000`)
```powershell
cd E:\E\VidyaMaxx\VidyaMaxx
pnpm --filter @vidyafloww/web dev
```

### Step 3: Start Any Decoupled Satellite App (`http://localhost:8010` – `8022`)
```powershell
cd E:\E\VidyaMaxx\Payments-VidyaFloww   # or any of the 12 *-VidyaFloww directories
pnpm install
pnpm dev
```
Sign in either via the Main Command Portal (`http://localhost:3000/login`) — sharing the `HttpOnly` refresh cookie across localhost ports — or directly via the **Sign In** button in the satellite header (`SatelliteAuthStatus`).

---

## 2. Production Go-Live Checklist

1. **Core Django & Security Settings**:
   - `DJANGO_SETTINGS_MODULE=config.settings.production`
   - `DEBUG=False`, strong `SECRET_KEY`, explicit `ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS` set to production `https://*.vidyafloww.com` domains with `CORS_ALLOW_CREDENTIALS=True`
   - `CSRF_TRUSTED_ORIGINS` configured for production HTTPS origins
   - TLS termination enabled so `Secure` cookies are enforced on `vidyafloww_refresh`
2. **Database & Cache**:
   - PostgreSQL 16/17 (`USE_SQLITE=false`, `DATABASE_URL=postgres://...`)
   - Redis (`REDIS_URL=redis://...`) for caching, DRF throttling, and Celery broker
   - Run `python manage.py migrate --noinput` and `python manage.py collectstatic --noinput`
   - Install `argon2-cffi` so `PASSWORD_HASHERS` automatically activates `Argon2PasswordHasher`
3. **External Provider Secrets (Activating Live Mode from Sandbox)**:
   - Payments: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - SMS (TRAI DLT): `MSG91_AUTH_KEY`, `MSG91_SENDER_ID`, `MSG91_DLT_TE_ID`
   - WhatsApp Cloud API: `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
   - Biometric Hardware: `BIOMETRIC_WEBHOOK_SECRET`
   - Google OAuth (optional): `GOOGLE_OAUTH_CLIENT_ID`
4. **Health & Observability**:
   - Readiness probe: `GET /api/v1/health/` (verifies live DB `SELECT 1` + cache round-trip)
   - Swagger UI / OpenAPI 3.1: `/api/docs/swagger/`, `/api/schema/`
