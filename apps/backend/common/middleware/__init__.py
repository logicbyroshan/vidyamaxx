"""
VidyaFloww Middleware & Tenant Context Resolution
"""

import logging
import time
import uuid
from django.db import connection
from django.utils.deprecation import MiddlewareMixin

from common.context import clear_request_context, set_request_context
from common.utils import get_client_ip

logger = logging.getLogger("vidyafloww.http")


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Assigns a correlation X-Request-ID, captures client IP, and logs
    request method/path/status/duration without ever logging sensitive payloads.
    """

    def process_request(self, request):
        clear_request_context()
        request_id = request.META.get("HTTP_X_REQUEST_ID") or str(uuid.uuid4())
        request.request_id = request_id
        request._start_time = time.monotonic()
        ip_addr = get_client_ip(request)
        set_request_context(request_id=request_id, ip_address=ip_addr)

    def process_response(self, request, response):
        request_id = getattr(request, "request_id", None)
        if request_id:
            response["X-Request-ID"] = request_id
        start_time = getattr(request, "_start_time", None)
        duration_ms = round((time.monotonic() - start_time) * 1000, 2) if start_time else 0.0
        logger.info(
            "http_request method=%s path=%s status=%s duration_ms=%s request_id=%s",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            request_id,
        )
        clear_request_context()
        return response


class TenantContextMiddleware(MiddlewareMixin):
    """
    Captures raw X-School-ID / X-Branch-ID headers cleanly and resets contextvars
    around every HTTP lifecycle. Verified Membership enforcement occurs after DRF
    JWTAuthentication inside common.permissions / TenantAPIViewMixin.
    """

    def process_request(self, request):
        raw_school_id = request.META.get("HTTP_X_SCHOOL_ID")
        raw_branch_id = request.META.get("HTTP_X_BRANCH_ID")
        request.requested_school_id = _parse_uuid(raw_school_id)
        request.requested_branch_id = _parse_uuid(raw_branch_id)
        request.school = None
        request.branch = None
        request.membership = None

    def process_response(self, request, response):
        clear_request_context()
        return response


def _parse_uuid(raw: str | None) -> uuid.UUID | None:
    if not raw:
        return None
    try:
        return uuid.UUID(str(raw).strip())
    except (ValueError, TypeError):
        return None


def bind_postgres_rls_school(school_id: uuid.UUID | None) -> None:
    """
    Sets PostgreSQL transaction-local GUC `app.current_school_id` when running on PostgreSQL
    as RLS defense-in-depth alongside Django queryset isolation.
    """
    if school_id is None:
        return
    if connection.vendor == "postgresql" and connection.in_atomic_block:
        with connection.cursor() as cursor:
            cursor.execute("SELECT set_config('app.current_school_id', %s, true)", [str(school_id)])
