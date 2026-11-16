"""
VidyaFloww Django Settings — Production Environment

Overrides base settings for production deployment.
All sensitive values must be provided via environment variables.
"""

import sentry_sdk

from .base import *  # noqa: F401, F403

# ─── Security ─────────────────────────────────────────────────────────────────

DEBUG = False
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")  # noqa: F405 - MUST be set in production
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "").split(",")  # noqa: F405

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = "DENY"

# ─── CORS ─────────────────────────────────────────────────────────────────────

CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")  # noqa: F405

# ─── Sentry Monitoring ────────────────────────────────────────────────────────

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),  # noqa: F405
    traces_sample_rate=0.1,
    profiles_sample_rate=0.1,
    environment="production",
)

# ─── Email ────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST")  # noqa: F405
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))  # noqa: F405
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")  # noqa: F405
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")  # noqa: F405
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@vidyafloww.com")  # noqa: F405

# ─── Static & Media (S3) ──────────────────────────────────────────────────────

# TODO: Configure django-storages for S3 when enabling cloud storage
# DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
# STATICFILES_STORAGE = "storages.backends.s3boto3.S3StaticStorage"
