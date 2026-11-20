# DOCUMENT 11: INFRASTRUCTURE, CONTAINERIZATION & DEPLOYMENT ARCHITECTURE

> **Classification**: `EVIDENCE-BASED INFRASTRUCTURE & DEVOPS AUDIT`  
> **Source Files**: `docker-compose.yml`, `Dockerfile`, `nginx/`, `apps/backend/config/settings/production.py`  

---

## 1. Containerization & Service Orchestration

VidyaFloww is pre-configured for containerized deployment using Docker and Docker Compose:

```
Infrastructure Services (docker-compose.yml):
  ├── nginx            (Ingress reverse proxy, SSL termination, static file serving)
  ├── backend          (Django Gunicorn WSGI & Uvicorn ASGI application server)
  ├── celery_worker    (Async task worker executing background jobs)
  ├── celery_beat      (Distributed periodic cron scheduler)
  ├── postgres         (PostgreSQL 16 relational database with persistent volume)
  └── redis            (In-memory cache, session blacklist & Celery broker)
```

---

## 2. Nginx Ingress Configuration (`nginx/conf.d/default.conf`)

Nginx routes traffic based on URL prefixes:
- `/` -> Proxied to Frontend Command Portal (or static build in production).
- `/api/` -> Proxied to Backend WSGI upstream (`http://backend:8000`).
- `/ws/` -> Upgraded to WebSocket and proxied to Daphne/Uvicorn ASGI upstream (`http://backend:8001`).
- `/static/` & `/media/` -> Served directly from high-speed shared Docker volumes with long-lived browser caching headers (`Cache-Control: max-age=31536000, immutable`).

---

## 3. Environment Variables Audit & Inventory

The platform uses 12-factor configuration through environment variables. An audit of `.env.example` vs. runtime settings reveals:

| Variable Name | Purpose | Production Requirement | Dev Fallback | Status |
|---|---|---|---|---|
| `DJANGO_SETTINGS_MODULE` | Active Django settings file | `config.settings.production` | `config.settings.development` | `VERIFIED` |
| `DJANGO_SECRET_KEY` | Cryptographic signing key | High-entropy random 64-char string | dev fallback string | `VERIFIED` |
| `DEBUG` | Enable debug mode | `False` | `True` | `VERIFIED` |
| `ALLOWED_HOSTS` | Allowed HTTP Host headers | e.g. `api.vidyaflow.com` | `localhost,127.0.0.1` | `VERIFIED` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` | SQLite fallback if `USE_SQLITE=true` | `VERIFIED` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379/0` | LocMemCache if `USE_LOCMEM_CACHE=true` | `VERIFIED` |
| `CELERY_BROKER_URL` | Broker URL for Celery tasks | `redis://redis:6379/1` | In-memory eager execution in dev | `VERIFIED` |
| `AWS_STORAGE_BUCKET_NAME`| S3 Bucket for file storage | Production S3 bucket name | Local filesystem storage | `VERIFIED` |
| `AWS_ACCESS_KEY_ID` | S3 IAM access key | Populated in production secret manager | N/A (Local storage) | `VERIFIED` |
| `AWS_SECRET_ACCESS_KEY` | S3 IAM secret key | Populated in production secret manager | N/A (Local storage) | `VERIFIED` |
| `RAZORPAY_KEY_ID` | Payment gateway API key | Production Razorpay key | Stub simulator | `VERIFIED` |
| `RAZORPAY_KEY_SECRET` | Payment gateway secret | Production Razorpay secret | Stub simulator | `VERIFIED` |
| `DLT_SMS_API_KEY` | TRAI DLT compliant SMS key | Production MSG91 key | Console logger | `VERIFIED` |

---

## 4. Production Deployment Architectures

### Production Topology Recommendation (AWS / GCP / Cloudflare)

```mermaid
flowchart TB
    CF["Cloudflare Edge (DNS, DDoS Protection, WAF, SSL)"]
    
    subgraph VPC["Virtual Private Cloud (VPC)"]
        ALB["Application Load Balancer (ALB)"]
        
        subgraph WebTier["Application Cluster (ECS / EKS)"]
            WSGI1["Backend Gunicorn App 1"]
            WSGI2["Backend Gunicorn App 2"]
            ASGI1["Backend ASGI Websocket App"]
            WKR1["Celery High-Priority Worker"]
            WKR2["Celery Report/PDF Worker"]
            BEAT["Celery Beat Scheduler"]
        end
        
        subgraph DataTier["Managed Data Layer"]
            RDS_PG["AWS RDS PostgreSQL (Multi-AZ Primary + Read Replica)"]
            ELAST_REDIS["AWS ElastiCache Redis Cluster"]
        end
    end
    
    subgraph StorageTier["Cloud Storage"]
        S3_MEDIA["AWS S3 Media Bucket (Encrypted, Versioned)"]
        S3_BACKUP["AWS S3 Database Backup Glacier Vault"]
    end

    CF --> ALB
    ALB --> WSGI1
    ALB --> WSGI2
    ALB --> ASGI1

    WSGI1 --> RDS_PG
    WSGI2 --> RDS_PG
    WSGI1 --> ELAST_REDIS
    WSGI2 --> ELAST_REDIS
    
    WSGI1 --> S3_MEDIA
    WSGI2 --> S3_MEDIA

    WKR1 --> ELAST_REDIS
    WKR2 --> ELAST_REDIS
    WKR1 --> RDS_PG
    WKR2 --> S3_MEDIA
    BEAT --> ELAST_REDIS
```

---

## 5. Zero-Downtime Migration & Rollout Strategy

1. **Database Schema Migrations**:
   - Backward-compatible migrations are run first via a pre-deployment container task:
     ```bash
     python manage.py migrate --noinput
     ```
2. **Static Asset Compilation**:
   - Collect static assets to shared storage:
     ```bash
     python manage.py collectstatic --noinput
     ```
3. **Graceful Application Reload**:
   - Send `HUP` signal to Gunicorn master process or execute rolling deployment on container cluster (ECS/K8s) with readiness probes targeting `GET /api/v1/health/`.
