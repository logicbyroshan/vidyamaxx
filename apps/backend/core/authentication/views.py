"""
VidyaFloww Authentication API Views
"""

from django.conf import settings
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import serializers as drf_serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from common.exceptions import VidyaFlowError
from common.permissions import resolve_user_tenant_context
from common.utils import get_client_ip
from core.accounts.models import User
from core.permissions.models import StaffResponsibilityAssignment
from core.users.models import Membership, UserType

from .serializers import (
    EmptyActionSerializer,
    LoginSerializer,
    MePreferencesSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetSerializer,
    RefreshTokenSerializer,
    RegisterSerializer,
    UsernameLookupSerializer,
)
from .services import (
    issue_otp,
    login_user,
    register_account,
    reset_user_password,
    revoke_session,
    rotate_refresh_token,
    validate_action_token,
    verify_otp,
)


class AuthAnonThrottle(AnonRateThrottle):
    rate = None

    def get_rate(self):
        if getattr(settings, "TESTING", False):
            return "10000/min"
        return "20/min"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="vidyafloww_refresh",
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60,
        path="/api/v1/auth/",
    )


def _serialize_membership(m: Membership) -> dict:
    return {
        "id": str(m.id),
        "user_type": m.user_type,
        "tenant_id": str(m.tenant_id),
        "tenant_name": m.tenant.name,
        "school_id": str(m.school_id) if m.school_id else None,
        "school_name": m.school.name if m.school else None,
        "school_code": m.school.short_code if m.school else None,
        "default_branch_id": str(m.default_branch_id) if m.default_branch_id else None,
        "preferences": m.preferences_json,
    }


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = login_user(
            identifier=serializer.validated_data["identifier"],
            password=serializer.validated_data["password"],
            device_info=serializer.validated_data.get("device_info"),
            ip_address=get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )
        user = result["user"]
        pm = result["primary_membership"]
        payload = {
            "success": True,
            "access_token": result["access_token"],
            "token_type": "Bearer",
            "expires_in": result["expires_in"],
            "user": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "is_verified": user.is_verified,
                "user_type": pm.user_type if pm else None,
                "active_school_id": str(pm.school_id) if pm and pm.school_id else None,
            },
            "memberships": [_serialize_membership(m) for m in result["memberships"]],
        }
        resp = Response(payload, status=status.HTTP_200_OK)
        _set_refresh_cookie(resp, result["refresh_token"])
        return resp


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        result = register_account(
            full_name=d["full_name"],
            email=d.get("email") or None,
            phone=d.get("phone") or None,
            school_code=d["school_code"],
            password=d["password"],
            user_type=d["user_type"],
        )
        return Response(
            {
                "success": True,
                "message": "Account initialized. Verification code dispatched.",
                "user_id": str(result["user"].id),
                "otp_expires_in": result["otp"]["expires_in"],
            },
            status=status.HTTP_201_CREATED,
        )


class OTPRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = OTPRequestSerializer

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        meta = issue_otp(**serializer.validated_data)
        return Response({"success": True, **meta}, status=status.HTTP_200_OK)


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = OTPVerifySerializer

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action_token = verify_otp(**serializer.validated_data)
        if serializer.validated_data["purpose"] == "registration":
            ident = serializer.validated_data["identifier"]
            User.objects.filter(email__iexact=ident).update(is_verified=True)
        return Response(
            {"success": True, "verified": True, "action_token": action_token},
            status=status.HTTP_200_OK,
        )


class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reset_user_password(
            action_token=serializer.validated_data["action_token"],
            new_password=serializer.validated_data["new_password"],
            ip_address=get_client_ip(request),
        )
        return Response(
            {"success": True, "message": "Password updated and active sessions invalidated."},
            status=status.HTTP_200_OK,
        )


class UsernameLookupView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthAnonThrottle]
    serializer_class = UsernameLookupSerializer

    def post(self, request):
        serializer = UsernameLookupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        validate_action_token(action_token=d["action_token"], expected_purpose="username_lookup")
        user = User.objects.filter(phone=d["phone"], date_of_birth=d["date_of_birth"]).first()
        if not user:
            raise VidyaFlowError(
                message="No institutional account matched those details.",
                code="USER_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        membership = Membership.objects.select_related("school").filter(user=user, is_active=True).first()
        return Response(
            {
                "success": True,
                "matched_user": {
                    "name": user.full_name,
                    "username": user.email or user.phone,
                    "user_type": membership.user_type if membership else None,
                    "institution": membership.school.name if membership and membership.school else None,
                },
            },
            status=status.HTTP_200_OK,
        )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        raw_refresh = request.data.get("refresh") or request.COOKIES.get("vidyafloww_refresh")
        if not raw_refresh:
            raise VidyaFlowError(
                message="Refresh token missing.",
                code="AUTH_REFRESH_MISSING",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        rotated = rotate_refresh_token(
            raw_refresh_token=raw_refresh, ip_address=get_client_ip(request)
        )
        resp = Response(
            {
                "success": True,
                "access_token": rotated["access_token"],
                "expires_in": rotated["expires_in"],
            },
            status=status.HTTP_200_OK,
        )
        _set_refresh_cookie(resp, rotated["refresh_token"])
        return resp


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmptyActionSerializer

    def post(self, request):
        raw_refresh = request.data.get("refresh") or request.COOKIES.get("vidyafloww_refresh")
        session_id = request.auth.get("session_id") if request.auth is not None and hasattr(request.auth, "get") else None
        revoke_session(
            user=request.user,
            raw_refresh_token=raw_refresh,
            session_id=session_id,
            ip_address=get_client_ip(request),
        )
        resp = Response({"success": True, "message": "Logged out cleanly."}, status=status.HTTP_200_OK)
        resp.delete_cookie("vidyafloww_refresh", path="/api/v1/auth/")
        return resp


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MePreferencesSerializer

    def get(self, request):
        membership = resolve_user_tenant_context(request, require_school=False)
        memberships = list(
            Membership.objects.select_related("tenant", "school", "default_branch")
            .filter(user=request.user, is_active=True)
        )

        responsibilities = []
        if membership and membership.user_type == UserType.STAFF and membership.school_id:
            now = timezone.now()
            assignments = StaffResponsibilityAssignment.objects.filter(
                membership=membership,
                revoked_at__isnull=True,
                valid_from__lte=now,
            )
            for a in assignments:
                if a.valid_until and a.valid_until <= now:
                    continue
                responsibilities.append(
                    {
                        "id": str(a.id),
                        "work_division": a.work_division,
                        "submodule_code": a.submodule_code,
                        "actions": a.actions,
                        "branch_ids": a.branch_ids,
                        "grade_class_ids": a.grade_class_ids,
                        "section_ids": a.section_ids,
                        "subject_ids": a.subject_ids,
                    }
                )

        return Response(
            {
                "success": True,
                "user": {
                    "id": str(request.user.id),
                    "full_name": request.user.full_name,
                    "hindi_name": request.user.hindi_name,
                    "email": request.user.email,
                    "phone": request.user.phone,
                    "is_verified": request.user.is_verified,
                },
                "active_membership": _serialize_membership(membership) if membership else None,
                "memberships": [_serialize_membership(m) for m in memberships],
                "responsibilities": responsibilities,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        """Update per-membership UI preferences (dashboard KPI order, shortcuts, language)."""
        membership = resolve_user_tenant_context(request, require_school=False)
        if not membership:
            raise VidyaFlowError(
                message="No active membership found.",
                code="MEMBERSHIP_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        prefs = dict(membership.preferences_json or {})
        incoming = request.data.get("preferences")
        if not isinstance(incoming, dict):
            raise VidyaFlowError(
                message="`preferences` must be a JSON object.",
                code="VALIDATION_ERROR",
            )
        prefs.update(incoming)
        membership.preferences_json = prefs
        membership.save(update_fields=["preferences_json", "updated_at"])
        return Response({"success": True, "preferences": membership.preferences_json})
