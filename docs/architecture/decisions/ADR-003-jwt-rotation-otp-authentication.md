# ADR-003: JWT Authentication with Refresh Token Rotation & OTP Flows

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
Clients include the web portal (`apps/web`), desktop Electron app (`apps/desktop`), Expo mobile app (`apps/mobile`), and 12 standalone micro-frontends on subdomains (`*.vidyafloww.com`). The `/login` UI also requires Email/UserID+Password, Google SSO, 4-step registration with OTP, password reset with OTP, and username recovery via Phone+DOB+OTP.

## Decision
Use `rest_framework_simplejwt` issuing:
- Short-lived **Access JWT (`15m`)** carrying `user_id`, `jti`, `user_type`, `session_id`, and `default_school_id`.
- **Refresh Token (`7d`)** delivered via `HttpOnly` secure cookie (for web/subdomains) and JSON (for mobile/Electron) with **token rotation + Redis blacklist** (`ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`) and tracked `DeviceSession` records so password resets or admin revocation invalidate all active sessions immediately.
- **OTP Verification**: CSPRNG 6-digit codes stored hashed in Redis (`5m TTL`, max 5 attempts, strict IP/identifier rate limits).

## Alternatives Rejected
- **Server-side Cookies Only**: Harder for mobile native clients and cross-origin dev ports.
- **Long-lived Stateless JWTs Without Blacklist**: Cannot revoke compromised sessions immediately.
