"""
VidyaFloww Django Settings — Development Environment

Overrides base settings for local development.
"""

from .base import *  # noqa: F401, F403

# ─── Security ─────────────────────────────────────────────────────────────────

DEBUG = True
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-insecure-secret-key-do-not-use-in-production")
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

# ─── CORS ─────────────────────────────────────────────────────────────────────

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Main Command Portal (apps/web)
    "http://127.0.0.1:3000",
    "http://localhost:5173",   # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:8010",   # Design Lab
    "http://localhost:8011",   # Hostel
    "http://localhost:8012",   # Transport
    "http://localhost:8013",   # HRM & Biometrics
    "http://localhost:8014",   # E-Library
    "http://localhost:8016",   # E-Class
    "http://localhost:8017",   # Parent & Student Portal
    "http://localhost:8018",   # Admissions
    "http://localhost:8019",   # LMS
    "http://localhost:8020",   # Payments Engine
    "http://localhost:8021",   # Examinations Engine
    "http://localhost:8022",   # Communication Hub
]
CORS_ALLOW_CREDENTIALS = True

# ─── Developer Tools ──────────────────────────────────────────────────────────

try:
    import debug_toolbar  # noqa: F401
    INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
    MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa: F405
    INTERNAL_IPS = ["127.0.0.1"]
except ImportError:
    pass

# ─── Email (Console backend for dev) ─────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ─── Database & Cache Fallbacks ───────────────────────────────────────────────

USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() in ("true", "1", "yes")

if USE_SQLITE:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "vidyafloww_dev.sqlite3",
        }
    }

if os.getenv("USE_LOCMEM_CACHE", "true").lower() in ("true", "1", "yes"):
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }
