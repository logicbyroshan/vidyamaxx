"""
VidyaFloww Authentication Services (JWT Rotation, OTP Verification, Password Reset, SSO)
"""

from datetime import timedelta
from typing import Any, Dict, Optional
import uuid

from django.conf import settings
from django.core import signing
from django.core.cache import cache
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from common.exceptions import VidyaFlowError
from common.utils import generate_numeric_otp, hash_value
from common.validators import normalize_indian_phone
from core.accounts.models import User
from core.organizations.models import School
from core.sessions.models import DeviceSession
from core.users.models import Membership
from platform_services.audit.services import record_audit_event


OTP_TTL_SECONDS = 300
OTP_MAX_ATTEMPTS = 5
ACTION_TOKEN_SALT = "vidyafloww.auth.action_token"


def _otp_cache_key(identifier: str, purpose: str) -> str:
    return f"vf:otp:{purpose}:{hash_value(identifier.lower())}"


def _build_token_pair(user: User, membership: Optional[Membership], session_id: uuid.UUID) -> Dict[str, Any]:
    refresh = RefreshToken.for_user(user)
    refresh["user_type"] = membership.user_type if membership else "UNSCOPED"
    refresh["default_school_id"] = str(membership.school_id) if membership and membership.school_id else None
    refresh["session_id"] = str(session_id)

    access = refresh.access_token
    access["user_type"] = refresh["user_type"]
    access["default_school_id"] = refresh["default_school_id"]
    access["session_id"] = str(session_id)

    return {
        "refresh": refresh,
        "access": str(access),
        "refresh_str": str(refresh),
        "refresh_jti": str(refresh["jti"]),
        "expires_in": int(access.lifetime.total_seconds()),
    }


def _find_user_by_identifier(identifier: str) -> Optional[User]:
    raw = identifier.strip()
    if "@" in raw:
        return User.objects.filter(email__iexact=raw).first()
    try:
        phone = normalize_indian_phone(raw)
        return User.objects.filter(phone=phone).first()
    except Exception:
        return User.objects.filter(Q(email__iexact=raw) | Q(phone=raw)).first()


@transaction.atomic
def login_user(*, identifier: str, password: str, device_info: Optional[dict] = None, ip_address: Optional[str] = None, user_agent: str = "") -> Dict[str, Any]:
    user = _find_user_by_identifier(identifier)
    if not user or not user.check_password(password):
        record_audit_event(
            action="LOGIN_FAILED",
            category="Auth",
            status="Warning",
            actor_user_id=user.id if user else None,
            actor_name=identifier[:120],
            ip_address=ip_address,
            metadata={"reason": "invalid_credentials"},
        )
        raise VidyaFlowError(
            message="The email/phone or password provided is incorrect.",
            code="AUTH_INVALID_CREDENTIALS",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_active:
        raise VidyaFlowError(
            message="This institutional account has been deactivated.",
            code="ACCOUNT_DISABLED",
            status_code=status.HTTP_403_FORBIDDEN,
        )

    memberships = list(
        Membership.objects.select_related("tenant", "school", "default_branch")
        .filter(user=user, is_active=True)
        .order_by("created_at")
    )
    primary_membership = memberships[0] if memberships else None

    session_id = uuid.uuid4()
    tokens = _build_token_pair(user, primary_membership, session_id)
    dev_info = device_info or {}

    DeviceSession.objects.create(
        id=session_id,
        user=user,
        refresh_jti=tokens["refresh_jti"],
        device_id=str(dev_info.get("deviceId", ""))[:120],
        platform=str(dev_info.get("platform", "web"))[:80],
        ip_address=ip_address,
        user_agent=user_agent[:255],
        expires_at=timezone.now() + timedelta(days=7),
    )

    user.last_login = timezone.now()
    user.save(update_fields=["last_login"])

    record_audit_event(
        school_id=primary_membership.school_id if primary_membership else None,
        tenant_id=primary_membership.tenant_id if primary_membership else None,
        actor_user_id=user.id,
        actor_name=user.full_name,
        actor_role_label=primary_membership.user_type if primary_membership else "USER",
        category="Auth",
        action="LOGIN_SUCCESS",
        target_type="User",
        target_id=str(user.id),
        ip_address=ip_address,
        status="Success",
    )

    return {
        "access_token": tokens["access"],
        "refresh_token": tokens["refresh_str"],
        "expires_in": tokens["expires_in"],
        "user": user,
        "memberships": memberships,
        "primary_membership": primary_membership,
    }


def rotate_refresh_token(*, raw_refresh_token: str, ip_address: Optional[str] = None) -> Dict[str, Any]:
    try:
        token = RefreshToken(raw_refresh_token)
    except TokenError as exc:
        raise VidyaFlowError(
            message="Refresh token is invalid or expired.",
            code="AUTH_REFRESH_INVALID",
            status_code=status.HTTP_401_UNAUTHORIZED,
        ) from exc

    old_jti = str(token["jti"])
    user_id = token.get("user_id")
    session_id = token.get("session_id")

    reuse_detected = False
    with transaction.atomic():
        session = DeviceSession.objects.select_for_update().filter(id=session_id, user_id=user_id).first()
        if not session:
            raise VidyaFlowError(
                message="Active session no longer exists.",
                code="SESSION_NOT_FOUND",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        # Refresh token reuse detection — commit revocation cleanly outside any failed-raise rollback
        if session.revoked_at is not None or session.refresh_jti != old_jti:
            DeviceSession.objects.filter(user_id=user_id, revoked_at__isnull=True).update(
                revoked_at=timezone.now(),
                revoke_reason="refresh_token_reuse_detected",
            )
            record_audit_event(
                actor_user_id=session.user_id,
                category="Auth",
                action="REFRESH_TOKEN_REUSE_BLOCKED",
                target_type="DeviceSession",
                target_id=str(session.id),
                ip_address=ip_address,
                status="Blocked",
            )
            reuse_detected = True
        else:
            user = User.objects.get(id=user_id)
            membership = Membership.objects.select_related("school", "tenant").filter(user=user, is_active=True).first()
            new_tokens = _build_token_pair(user, membership, session.id)

            session.previous_refresh_jti = old_jti
            session.refresh_jti = new_tokens["refresh_jti"]
            session.expires_at = timezone.now() + timedelta(days=7)
            session.save(update_fields=["previous_refresh_jti", "refresh_jti", "expires_at", "last_active_at"])

    if reuse_detected:
        raise VidyaFlowError(
            message="Session invalidated due to suspicious token replay.",
            code="AUTH_TOKEN_REUSE_DETECTED",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    return {
        "access_token": new_tokens["access"],
        "refresh_token": new_tokens["refresh_str"],
        "expires_in": new_tokens["expires_in"],
    }


def revoke_session(*, user: User, raw_refresh_token: Optional[str] = None, session_id: Optional[str] = None, ip_address: Optional[str] = None) -> None:
    now = timezone.now()
    qs = DeviceSession.objects.filter(user=user, revoked_at__isnull=True)
    if session_id:
        qs = qs.filter(id=session_id)
    elif raw_refresh_token:
        try:
            tok = RefreshToken(raw_refresh_token)
            qs = qs.filter(refresh_jti=str(tok["jti"]))
        except TokenError:
            pass
    qs.update(revoked_at=now, revoke_reason="user_logout")
    record_audit_event(
        actor_user_id=user.id,
        actor_name=user.full_name,
        category="Auth",
        action="LOGOUT",
        ip_address=ip_address,
        status="Success",
    )


def issue_otp(*, identifier: str, purpose: str) -> Dict[str, Any]:
    otp_code = generate_numeric_otp(6)
    key = _otp_cache_key(identifier, purpose)
    salt = settings.SECRET_KEY[:16]
    cache.set(
        key,
        {"hash": hash_value(otp_code, salt), "attempts": 0},
        timeout=OTP_TTL_SECONDS,
    )
    result = {"expires_in": OTP_TTL_SECONDS, "purpose": purpose}
    # Never leak OTP in production responses; return only in explicit DEBUG/testing modes
    if settings.DEBUG or getattr(settings, "TESTING", False):
        result["dev_otp"] = otp_code
    return result


def verify_otp(*, identifier: str, otp_code: str, purpose: str) -> str:
    key = _otp_cache_key(identifier, purpose)
    entry = cache.get(key)
    if not entry:
        raise VidyaFlowError(
            message="OTP expired or invalid.",
            code="OTP_EXPIRED",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if entry["attempts"] >= OTP_MAX_ATTEMPTS:
        cache.delete(key)
        raise VidyaFlowError(
            message="Maximum OTP attempts exceeded. Request a new code.",
            code="OTP_ATTEMPTS_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    salt = settings.SECRET_KEY[:16]
    if hash_value(otp_code.strip(), salt) != entry["hash"]:
        entry["attempts"] += 1
        cache.set(key, entry, timeout=OTP_TTL_SECONDS)
        raise VidyaFlowError(
            message="Incorrect verification code.",
            code="OTP_INVALID",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    cache.delete(key)
    signer = signing.TimestampSigner(salt=ACTION_TOKEN_SALT)
    return signer.sign_object({"identifier": identifier.lower(), "purpose": purpose})


def validate_action_token(*, action_token: str, expected_purpose: str) -> str:
    signer = signing.TimestampSigner(salt=ACTION_TOKEN_SALT)
    try:
        payload = signer.unsign_object(action_token, max_age=300)
    except signing.BadSignature as exc:
        raise VidyaFlowError(
            message="Verification action token is invalid or expired.",
            code="ACTION_TOKEN_INVALID",
            status_code=status.HTTP_400_BAD_REQUEST,
        ) from exc

    if payload.get("purpose") != expected_purpose:
        raise VidyaFlowError(
            message="Action token purpose mismatch.",
            code="ACTION_TOKEN_MISMATCH",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return payload["identifier"]


@transaction.atomic
def reset_user_password(*, action_token: str, new_password: str, ip_address: Optional[str] = None) -> None:
    identifier = validate_action_token(action_token=action_token, expected_purpose="password_reset")
    user = _find_user_by_identifier(identifier)
    if not user:
        raise VidyaFlowError(
            message="Account not found.",
            code="USER_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )

    user.set_password(new_password)
    user.password_changed_at = timezone.now()
    user.save(update_fields=["password", "password_changed_at", "updated_at"])

    # Invalidate every active device session immediately
    DeviceSession.objects.filter(user=user, revoked_at__isnull=True).update(
        revoked_at=timezone.now(),
        revoke_reason="password_reset",
    )

    record_audit_event(
        actor_user_id=user.id,
        actor_name=user.full_name,
        category="Auth",
        action="PASSWORD_RESET_SUCCESS",
        target_type="User",
        target_id=str(user.id),
        ip_address=ip_address,
        status="Success",
    )


@transaction.atomic
def register_account(*, full_name: str, email: Optional[str], phone: Optional[str], school_code: str, password: str, user_type: str) -> Dict[str, Any]:
    school = School.objects.select_related("tenant").filter(short_code__iexact=school_code.strip(), is_active=True).first()
    if not school:
        raise VidyaFlowError(
            message="No active school found matching the supplied school code.",
            code="SCHOOL_NOT_FOUND",
            errors={"school_code": ["Invalid school affiliation/short code."]},
            status_code=status.HTTP_404_NOT_FOUND,
        )

    if email and User.objects.filter(email__iexact=email).exists():
        raise VidyaFlowError(
            message="An account with this email already exists.",
            code="DUPLICATE_EMAIL",
            errors={"email": ["Email already registered."]},
            status_code=status.HTTP_409_CONFLICT,
        )

    user = User.objects.create_user(
        email=email,
        phone=phone,
        password=password,
        full_name=full_name,
        is_verified=False,
    )
    Membership.objects.create(
        user=user,
        tenant=school.tenant,
        school=school,
        user_type=user_type,
        is_active=True,
    )
    otp_meta = issue_otp(identifier=email or phone, purpose="registration")
    return {"user": user, "school": school, "otp": otp_meta}
