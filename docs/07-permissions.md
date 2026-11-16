# 07 — Permissions

## Permission Model

VidyaFloww uses a **hierarchical Role-Based Access Control (RBAC)** system combined with
**object-level permissions** for multi-tenant isolation.

## Role Hierarchy

```
SuperAdmin
  └── OrgAdmin (per Organization)
        └── CampusAdmin (per Campus)
              ├── Principal
              │     └── Teacher
              ├── Accountant
              ├── Librarian
              └── Staff
Student / Parent (limited self-service access)
```

## Roles

| Role | Scope | Description |
|------|-------|-------------|
| `super_admin` | Platform | Full platform access |
| `org_admin` | Organization | Full org-wide access |
| `campus_admin` | Campus | Full campus access |
| `principal` | Campus | Academic management |
| `teacher` | Campus | Own classes and students |
| `accountant` | Campus | Finance module only |
| `librarian` | Campus | Library module only |
| `staff` | Campus | Read-only + limited actions |
| `student` | Self | Own data only |
| `parent` | Self | Child's data only |

## Permission Enforcement

### Backend
- Use DRF `IsAuthenticated` as the base permission
- Create custom permission classes per resource in `{module}/permissions.py`
- Always check both authentication and organization membership

```python
# Example permission class (TODO: implement)
class IsOrgMemberOrAdmin(BasePermission):
    """Allow access to members of the request organization."""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.organization_id == request.org.id
        )

    def has_object_permission(self, request, view, obj):
        return obj.organization_id == request.user.organization_id
```

### Frontend
- Store user roles and permissions in Zustand auth store
- Use `usePermissions()` hook to check access before rendering
- Always enforce permissions on backend — frontend checks are UX only

## Object-Level Permissions

> TODO: Evaluate `django-rules` or `django-guardian` for object-level permissions.

For fine-grained permissions (e.g., teacher can only see their own students):
- Implement in selectors using user-scoped querysets
- Never rely solely on view-level checks for data isolation

## API Permission Headers

All API requests must include the JWT bearer token.
The token encodes: `user_id`, `organization_id`, `campus_id`, `role`.

---

*Last updated: 2026-07-02*
