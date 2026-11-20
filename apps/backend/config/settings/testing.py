"""
VidyaFloww Django Settings — Testing Environment

Overrides base settings for automated testing.
Uses fast password hasher, in-memory cache, and synchronous Celery.
"""

from .base import *  # noqa: F401, F403

# ─── Speed Optimizations ──────────────────────────────────────────────────────

DEBUG = False
TESTING = True
SECRET_KEY = "test-secret-key-not-for-production"
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {"anon": "10000/hour", "user": "10000/hour"}  # noqa: F405

# ─── Database ─────────────────────────────────────────────────────────────────

import os as _os

if _os.getenv("USE_POSTGRES_TEST", "false").lower() == "true":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": _os.getenv("POSTGRES_DB", "vidyafloww_pg_qa"),
            "USER": _os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": _os.getenv("POSTGRES_PASSWORD", ""),
            "HOST": _os.getenv("POSTGRES_HOST", "127.0.0.1"),
            "PORT": _os.getenv("POSTGRES_PORT", "5433"),
            "OPTIONS": {"sslmode": _os.getenv("POSTGRES_SSL_MODE", "disable")},
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }

# ─── Cache ────────────────────────────────────────────────────────────────────

CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}

# ─── Celery ───────────────────────────────────────────────────────────────────

CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# ─── Email ────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# ─── Media ────────────────────────────────────────────────────────────────────

DEFAULT_FILE_STORAGE = "django.core.files.storage.InMemoryStorage"
