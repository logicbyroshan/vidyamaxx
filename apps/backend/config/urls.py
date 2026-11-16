"""
VidyaFloww Root URL Configuration

All API routes are versioned under /api/v1/.
Schema and documentation endpoints are mounted for development.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # ─── Admin ──────────────────────────────────────────────────────────────
    path("admin/", admin.site.urls),

    # ─── API v1 ─────────────────────────────────────────────────────────────
    # TODO: Include app-specific URL modules as they are implemented
    # path("api/v1/auth/", include("core.authentication.urls")),
    # path("api/v1/users/", include("core.users.urls")),
    # path("api/v1/organizations/", include("core.organizations.urls")),
    # path("api/v1/students/", include("modules.students.urls")),

    # ─── API Schema & Docs ───────────────────────────────────────────────────
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
