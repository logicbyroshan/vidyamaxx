# ADR-002: PostgreSQL Shared-Schema Multi-Tenancy with RLS Defense-in-Depth

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
VidyaFloww serves multiple SaaS customers (`CustomerTenant`), each potentially owning multiple `School`s and `Branch`es, while individual `User`s may hold memberships in multiple schools. Data leakage between schools is unacceptable.

## Decision
Adopt a **shared PostgreSQL database & shared schema** with explicit hierarchical foreign keys (`tenant_id`, `school_id`, optional `branch_id`) on every domain table, enforced through:
1. `TenantContextMiddleware` validating `X-School-ID` / `X-Branch-ID` against an active `Membership` row.
2. Explicit `.for_school(school_id)` selectors & `TenantManager` defaults.
3. PostgreSQL Row-Level Security (RLS) policies on sensitive tables bound to `current_setting('app.current_school_id', true)::uuid` as a second layer of defense.

## Alternatives Rejected
- **Database-per-School**: Rejected because migrations across 1,000+ school DBs and connection pooling become operational bottlenecks.
- **Postgres Schema-per-Tenant (`django-tenants`)**: Rejected because a user belonging to multiple schools or cross-school Super Admin views suffer search_path complexity and migration fan-out.

## Consequences
- Zero-downtime single-schema migrations and efficient PgBouncer connection pooling.
- Strict requirement that every selector/test asserts cross-school isolation (`403`/`404`).
