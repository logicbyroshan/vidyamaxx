"""
VidyaFloww Execution Context

Provides coroutine- and thread-safe context variables for request ID,
client IP, authenticated user, and validated tenant/school/branch context.
"""

from contextvars import ContextVar
from typing import Optional
import uuid

_request_id_var: ContextVar[Optional[str]] = ContextVar("vidyafloww_request_id", default=None)
_ip_address_var: ContextVar[Optional[str]] = ContextVar("vidyafloww_ip_address", default=None)
_user_id_var: ContextVar[Optional[uuid.UUID]] = ContextVar("vidyafloww_user_id", default=None)
_tenant_id_var: ContextVar[Optional[uuid.UUID]] = ContextVar("vidyafloww_tenant_id", default=None)
_school_id_var: ContextVar[Optional[uuid.UUID]] = ContextVar("vidyafloww_school_id", default=None)
_branch_id_var: ContextVar[Optional[uuid.UUID]] = ContextVar("vidyafloww_branch_id", default=None)


def set_request_context(
    *,
    request_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_id: Optional[uuid.UUID] = None,
    tenant_id: Optional[uuid.UUID] = None,
    school_id: Optional[uuid.UUID] = None,
    branch_id: Optional[uuid.UUID] = None,
) -> None:
    if request_id is not None:
        _request_id_var.set(request_id)
    if ip_address is not None:
        _ip_address_var.set(ip_address)
    if user_id is not None:
        _user_id_var.set(user_id)
    if tenant_id is not None:
        _tenant_id_var.set(tenant_id)
    if school_id is not None:
        _school_id_var.set(school_id)
    if branch_id is not None:
        _branch_id_var.set(branch_id)


def clear_request_context() -> None:
    _request_id_var.set(None)
    _ip_address_var.set(None)
    _user_id_var.set(None)
    _tenant_id_var.set(None)
    _school_id_var.set(None)
    _branch_id_var.set(None)


def get_request_id() -> Optional[str]:
    return _request_id_var.get()


def get_ip_address() -> Optional[str]:
    return _ip_address_var.get()


def get_current_user_id() -> Optional[uuid.UUID]:
    return _user_id_var.get()


def get_current_tenant_id() -> Optional[uuid.UUID]:
    return _tenant_id_var.get()


def get_current_school_id() -> Optional[uuid.UUID]:
    return _school_id_var.get()


def get_current_branch_id() -> Optional[uuid.UUID]:
    return _branch_id_var.get()
