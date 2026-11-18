# ADR-001: Modular Django Monolith

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
VidyaFloww spans 30 school work divisions with dense relational cross-links (Students, Enrollments, Attendance, Timetable, Fees, Examinations, Audit). Splitting every work division into separate microservices would introduce distributed transaction complexity, network latency, and DevOps overhead. Conversely, a single monolithic Django app would produce circular imports and unmaintainable `models.py`/`views.py` files.

## Decision
Implement the core backend (`apps/backend`) as a **Modular Django Monolith** organized into explicit layers (`core`, `platform_services`, `modules`, `ai`, `integrations`) with a strict layered pattern inside each app: `Views -> Serializers -> Selectors (Reads) / Services (Writes) -> Models -> Celery Tasks`. Cross-app writes must invoke target domain Services rather than mutating foreign models directly.

## Alternatives Rejected
- **30 Independent Microservices**: Rejected due to distributed joins, 2PC/Saga complexity for simple operations (e.g., admission approval -> student + enrollment + fee invoice), and high operational cost.
- **Single Flat Django App**: Rejected due to schema tangling and lack of domain ownership.

## Consequences
- Single atomic `transaction.atomic()` covers cross-module invariants (enrollment + fee assignment + audit).
- Clear app boundaries allow future extraction of hot paths if scale demands it.
