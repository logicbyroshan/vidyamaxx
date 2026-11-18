"""
VidyaFloww Root URL Configuration

All API routes are versioned under /api/v1/.
Schema and documentation endpoints are mounted for development.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def health_check_view(_request):
    """Lightweight readiness probe verifying database & cache availability."""
    db_ok = True
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        db_ok = False

    cache_ok = True
    try:
        cache.set("vf:health:ping", "pong", timeout=5)
        cache_ok = cache.get("vf:health:ping") == "pong"
    except Exception:
        cache_ok = False

    healthy = db_ok and cache_ok
    return JsonResponse(
        {
            "status": "ok" if healthy else "degraded",
            "database": "ok" if db_ok else "error",
            "cache": "ok" if cache_ok else "error",
        },
        status=200 if healthy else 503,
    )


urlpatterns = [
    # ─── Admin ──────────────────────────────────────────────────────────────
    path("admin/", admin.site.urls),

    # ─── API v1 Foundation ──────────────────────────────────────────────────
    path("api/v1/health/", health_check_view, name="health-check"),
    path("api/v1/auth/", include("core.authentication.urls")),
    path("api/v1/", include("core.organizations.urls")),
    path("api/v1/schools/", include("core.campuses.urls")),
    path("api/v1/permissions/", include("core.permissions.urls")),
    path("api/v1/audit/", include("platform_services.audit.urls")),
    path("api/v1/storage/", include("platform_services.storage.urls")),
    path("api/v1/notifications/", include("platform_services.notifications.urls")),

    # ─── API v1 Phase 2: Core Institutional Data ────────────────────────────
    path("api/v1/academics/", include("modules.academics.urls")),
    path("api/v1/staff/", include("modules.hr.urls")),
    path("api/v1/students/", include("modules.students.urls")),
    path("api/v1/admissions/", include("modules.admissions.urls")),

    # ─── API v1 Phase 3: Daily Academic Operations ──────────────────────────
    path("api/v1/timetable/", include("modules.timetable.urls")),
    path("api/v1/attendance/", include("modules.attendance.urls")),
    path("api/v1/teaching/", include("modules.lms.urls")),
    path("api/v1/homework/", include("modules.homework.urls")),
    path("api/v1/examinations/", include("modules.examinations.urls")),

    # ─── API Schema & Docs ──────────────────────────────────────────────────
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
