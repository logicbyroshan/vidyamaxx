# ADR-005: External Subsystem Integration Contracts

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
Twelve UI modules reside outside `apps/web` in `*-VidyaFloww`. Six (`Design-Lab`, `Hostel`, `Transport`, `HRM`, `E-Library`, `E-Class`) represent specialized operational boundaries (telematics, DRM, WebRTC, vector rendering, biometric clocks), while six (`Portal`, `Admissions`, `LMS`, `Payments`, `Examinations`, `Communication`) are decoupled UI portals sharing core school data.

## Decision
1. Core Django backend owns domain APIs for core-coupled decoupled UIs (`Portal`, `Admissions`, `LMS`, `Payments`, `Examinations`, `Communication`).
2. Hardware/media-heavy subsystems (`Transport`, `Hostel`, `HRM`, `E-Library`, `Design Lab`, `E-Class`) interact via dedicated adapter contracts under `apps/backend/integrations/` using shared canonical UUIDs (`school_id`, `student_id`, `staff_id`) and HMAC-signed webhooks without duplicating their internal telemetry/media engines.
3. Reconcile mismatched dev ports in `packages/constants/src/subsystems.ts`.
