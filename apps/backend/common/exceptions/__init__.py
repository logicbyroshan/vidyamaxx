"""
VidyaFloww Standardized Exceptions & DRF Exception Handler

Ensures every API failure returns a consistent envelope compatible with
@vidyafloww/api's ApiError class:
{
  "success": false,
  "code": "...",
  "message": "...",
  "errors": { ... }
}
"""

from typing import Any, Dict, Optional
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import APIException, AuthenticationFailed, NotAuthenticated, PermissionDenied, Throttled, ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


class VidyaFlowError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "DOMAIN_ERROR"
    default_detail = "A domain rule validation error occurred."

    def __init__(
        self,
        message: Optional[str] = None,
        code: Optional[str] = None,
        errors: Optional[Dict[str, Any]] = None,
        status_code: Optional[int] = None,
    ):
        self.code_str = code or self.default_code
        self.message_str = message or str(self.default_detail)
        self.errors_dict = errors or {}
        if status_code is not None:
            self.status_code = status_code
        super().__init__(detail=self.message_str, code=self.code_str)


class ConflictError(VidyaFlowError):
    status_code = status.HTTP_409_CONFLICT
    default_code = "RESOURCE_CONFLICT"


class ForbiddenActionError(VidyaFlowError):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "FORBIDDEN_ACTION"


class TenantAccessDeniedError(VidyaFlowError):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "TENANT_ACCESS_DENIED"


def _flatten_drf_errors(detail: Any) -> Dict[str, Any]:
    if isinstance(detail, dict):
        result = {}
        for k, v in detail.items():
            if isinstance(v, list):
                result[k] = [str(item) for item in v]
            elif isinstance(v, dict):
                result[k] = _flatten_drf_errors(v)
            else:
                result[k] = [str(v)]
        return result
    if isinstance(detail, list):
        return {"non_field_errors": [str(item) for item in detail]}
    return {"non_field_errors": [str(detail)]}


def custom_exception_handler(exc: Exception, context: Dict[str, Any]) -> Optional[Response]:
    if isinstance(exc, DjangoValidationError):
        detail = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
        exc = DRFValidationError(detail=detail)
    elif isinstance(exc, Http404):
        return Response(
            {
                "success": False,
                "code": "RESOURCE_NOT_FOUND",
                "message": "The requested resource was not found.",
                "errors": {},
            },
            status=status.HTTP_404_NOT_FOUND,
        )
    elif isinstance(exc, DjangoPermissionDenied):
        return Response(
            {
                "success": False,
                "code": "INSUFFICIENT_PERMISSIONS",
                "message": str(exc) or "You do not have permission to perform this action.",
                "errors": {},
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if isinstance(exc, VidyaFlowError):
        return Response(
            {
                "success": False,
                "code": exc.code_str,
                "message": exc.message_str,
                "errors": exc.errors_dict,
            },
            status=exc.status_code,
        )

    response = exception_handler(exc, context)
    if response is None:
        return None

    code = "API_ERROR"
    message = "Request could not be processed."
    errors: Dict[str, Any] = {}

    if isinstance(exc, DRFValidationError):
        code = "VALIDATION_ERROR"
        message = "Please correct the highlighted fields."
        errors = _flatten_drf_errors(response.data)
    elif isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
        code = "AUTH_INVALID_CREDENTIALS" if isinstance(exc, AuthenticationFailed) else "AUTH_REQUIRED"
        message = str(exc.detail)
    elif isinstance(exc, PermissionDenied):
        code = "INSUFFICIENT_PERMISSIONS"
        message = str(exc.detail)
    elif isinstance(exc, Throttled):
        code = "RATE_LIMIT_EXCEEDED"
        message = f"Too many requests. Retry after {int(exc.wait or 60)} seconds."
    else:
        if isinstance(response.data, dict) and "detail" in response.data:
            message = str(response.data["detail"])
        elif hasattr(exc, "default_code"):
            code = str(getattr(exc, "default_code", "API_ERROR")).upper()

    response.data = {
        "success": False,
        "code": code,
        "message": message,
        "errors": errors,
    }
    return response
