# 05 — API Guidelines

## Purpose

Defines standards for designing, implementing, and documenting the VidyaFloww REST API.
All backend endpoints must follow these conventions to ensure a consistent developer experience.

## URL Structure

```
/api/v1/{resource}/
/api/v1/{resource}/{id}/
/api/v1/{resource}/{id}/{sub-resource}/
```

**Rules**:
- Use **plural nouns** for resource names: `/students/` not `/student/`
- Use **kebab-case** for multi-word resources: `/student-applications/`
- Keep URLs **lowercase**
- Actions that don't fit CRUD: use `@action` decorators with verb suffixes: `/api/v1/admissions/{id}/approve/`

## HTTP Methods

| Method | Usage | Body | Response |
|--------|-------|------|----------|
| `GET` | Read/list | None | 200 OK |
| `POST` | Create | JSON | 201 Created |
| `PUT` | Full update | JSON | 200 OK |
| `PATCH` | Partial update | JSON | 200 OK |
| `DELETE` | Delete | None | 204 No Content |

## Response Format

### Success

```json
{
  "data": { ... },
  "status": "success"
}
```

### Paginated List

```json
{
  "count": 150,
  "next": "/api/v1/students/?page=3",
  "previous": "/api/v1/students/?page=1",
  "results": [ ... ]
}
```

### Error

```json
{
  "status": "error",
  "code": "STUDENT_NOT_FOUND",
  "message": "Student with ID 123 not found.",
  "errors": {
    "email": ["This email is already in use."]
  }
}
```

## Versioning

- All endpoints are versioned under `/api/v1/`
- When breaking changes are required, introduce `/api/v2/` endpoints
- Never modify an existing endpoint in a breaking way without version bumping

## Authentication

- Use **JWT Bearer tokens** via `Authorization: Bearer <token>` header
- Access tokens expire in **15 minutes**
- Refresh tokens expire in **7 days**
- Refresh endpoint: `POST /api/v1/auth/token/refresh/`

## Pagination

- Default page size: **20**
- Maximum page size: **100**
- Parameters: `?page=1&page_size=20&ordering=-created_at&search=john`

## Filtering

- Use `django-filter` for all filterable endpoints
- Define filter classes in `filters.py` for each app
- Document available filters in OpenAPI schema

## API Documentation

- **Swagger UI**: `/api/docs/swagger/`
- **ReDoc**: `/api/docs/redoc/`
- **OpenAPI Schema**: `/api/schema/`
- Use `drf-spectacular` decorators to enrich auto-generated docs

## Rate Limiting

> TODO: Implement rate limiting with `django-ratelimit` or DRF throttling classes.

Planned limits:
- Anonymous: 100 req/hour
- Authenticated: 1000 req/hour
- Admin endpoints: 5000 req/hour

---

*Last updated: 2026-07-02*
