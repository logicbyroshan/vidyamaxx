# ADR-008: API Versioning, Envelope & Error Contract

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
`packages/api/src/errors.ts` expects `{ code, message, errors }` while `API_DOCUMENTATION.md` and `docs/05-api-guidelines.md` show `/api/v1/` versioned endpoints and `drf-spectacular` schemas.

## Decision
1. Mount all REST endpoints under `/api/v1/` (future breaking revisions under `/api/v2/`).
2. Standardize DRF custom exception handler in `common/exceptions/` to always emit:
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Human readable summary.",
  "errors": { "field": ["Reason"] }
}
```
3. Standardize pagination via `StandardResultsSetPagination` (`count`, `next`, `previous`, `results`) matching `PaginatedResponse<T>` in `@vidyafloww/api`.
4. Maintain live OpenAPI 3.1 contract via `drf-spectacular` at `/api/schema/`.
