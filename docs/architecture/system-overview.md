# VidyaFloww — System Overview

VidyaFloww is built as an institutional operating system for Indian and international K-12 schools and school groups.

## Architectural Layers

1. **Presentation Layer**:
   - **Core Command Portal (`apps/web`)**: 19 operational routes covering core ERP administration, curriculum, timetable, daily attendance, faculty management, homework, teaching workspace, complaints/helpdesk, surveys, BI statistics/reports, security, audit, and license billing.
   - **12 Decoupled Micro-Apps (`*-VidyaFloww`)**: Independently deployable Vite/React frontends for high-traffic portals (Parent/Student Portal, Public Admissions), latency/hardware-heavy apps (Transport, E-Class, HRM/Biometrics, Hostel, E-Library, Design Lab), financial isolation (Payments Engine), confidential testing (Examinations Engine), media delivery (LMS), and high-volume messaging (Communication Hub).
   - **Native Wrappers**: `apps/desktop` (Electron) and `apps/mobile` (Expo/React Native).
2. **Application & API Layer (`apps/backend`)**:
   - Unified Django 5 + DRF modular monolith serving versioned `/api/v1/` JSON endpoints, OpenAPI 3.1 docs via `drf-spectacular`, and `/ws/` WebSockets via Django Channels.
   - Strict separation: `Views -> Serializers -> Selectors (Reads) / Services (Writes) -> Models -> Celery Tasks`.
3. **Data & Infrastructure Layer**:
   - PostgreSQL 16/17 primary transactional store with decimal financial precision (`DECIMAL(12,2)`), strict foreign keys, check constraints, and `tenant`/`school` isolation.
   - Redis 7 for cache, SimpleJWT token blacklist/rotation tracking, OTP storage, WebSocket channel layer, and Celery broker.
   - Local media store (dev) / Private S3 bucket with presigned download URLs (production).
