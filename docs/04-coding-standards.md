# 04 — Coding Standards

## Purpose

This document defines the coding standards for all code written in the VidyaFloww monorepo.
Consistency and readability are non-negotiable. All code must meet these standards before merging.

---

## General Principles

1. **Clarity over cleverness** — Write code that any developer can understand immediately.
2. **Single responsibility** — Every function, class, and module should do one thing.
3. **Explicit over implicit** — Be verbose when it aids understanding.
4. **No magic** — Avoid hidden behavior; document non-obvious decisions.
5. **Fail loudly** — Validate inputs early, raise exceptions, never silently swallow errors.

---

## Python / Django Standards

### Code Style
- **Formatter**: Ruff (`ruff format`) — configured in `pyproject.toml`
- **Linter**: Ruff (`ruff check`) with E, F, W, I, N, UP, B, SIM rules
- **Type hints**: Required on all public functions and methods
- **Line length**: 119 characters maximum
- **Python version**: 3.13+

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | `snake_case` | `get_student_by_id()` |
| Classes | `PascalCase` | `StudentSerializer` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_UPLOAD_SIZE` |
| Private methods | `_leading_underscore` | `_normalize_phone()` |
| Files/modules | `snake_case` | `student_services.py` |

### Django-Specific Rules

- **Never put business logic in views.** Views are thin HTTP handlers only.
- **Use selectors for reads, services for writes.** See architecture doc for pattern.
- **All models must inherit from a base `TimestampedModel`** (with `created_at`, `updated_at`).
- **All models must have `__str__`** returning a human-readable string.
- **Avoid raw SQL.** Use ORM, annotate, or select_related/prefetch_related.
- **Never use `*` imports.**
- **Always use `get_object_or_404` in views, not bare `.get()`.** Let services raise proper exceptions.

```python
# ✅ Good
def get_student(*, student_id: int, organization_id: int) -> Student:
    """Fetch a student by ID within an organization."""
    try:
        return Student.objects.select_related("user", "campus").get(
            id=student_id,
            organization_id=organization_id,
        )
    except Student.DoesNotExist:
        raise StudentNotFoundError(f"Student {student_id} not found.")

# ❌ Bad
def get_student(student_id, org_id):
    return Student.objects.get(id=student_id)
```

### Serializers

- Input serializers and output serializers should be **separate classes**.
- Input serializers handle validation; output serializers handle representation.
- Never use `ModelSerializer.save()` directly in views — call a service function.

### Error Handling

- Define custom exception classes in `common.exceptions`.
- Map exceptions to HTTP status codes in a DRF exception handler (to be implemented).
- Log all unexpected exceptions with `logger.exception()`.

---

## TypeScript / React Standards

### Code Style
- **Formatter**: Prettier — configured in `.prettierrc`
- **Linter**: ESLint — configured in `.eslintrc`
- **TypeScript**: Strict mode enabled
- **Line length**: 100 characters

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | `PascalCase` | `StudentCard` |
| Hooks | `camelCase` with `use` prefix | `useStudentList` |
| Utilities | `camelCase` | `formatDate()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE` |
| Types/Interfaces | `PascalCase` | `StudentProfile` |
| Files | `kebab-case` | `student-card.tsx` |

### React Rules

- **Always use functional components.** No class components.
- **Use TypeScript for all props.** Never use `any`.
- **Extract business logic into hooks.** Components should only render.
- **Co-locate files.** Put component, styles, tests, and stories together.
- **Avoid prop drilling beyond 2 levels.** Use Zustand or context.

```tsx
// ✅ Good
interface StudentCardProps {
  studentId: string;
  onSelect: (id: string) => void;
}

export function StudentCard({ studentId, onSelect }: StudentCardProps): JSX.Element {
  const { data: student, isLoading } = useStudent(studentId);

  if (isLoading) return <Skeleton />;
  if (!student) return null;

  return (
    <Card onClick={() => onSelect(studentId)}>
      <CardContent>{student.name}</CardContent>
    </Card>
  );
}

// ❌ Bad
export function StudentCard(props: any) {
  const [student, setStudent] = useState(null);
  useEffect(() => { fetch(...).then(r => setStudent(r.json())); }, []);
  return <div onClick={() => props.onSelect(props.id)}>{student?.name}</div>;
}
```

### TanStack Query Rules

- Define query keys in a `queryKeys.ts` file per feature.
- Use `queryOptions` factory for reusability.
- Handle `isLoading`, `isError`, and empty states in every list component.

---

## Git Commit Standards

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Examples**:
```
feat(students): add bulk import via CSV
fix(auth): resolve token refresh race condition
docs(api): document pagination parameters
chore(deps): upgrade React to 19.1.0
```

---

## Testing Standards

### Backend
- **Minimum coverage**: 80% for service and selector functions
- **Use factories**: `factory_boy` for test data, never hardcoded fixtures
- **Test naming**: `test_<method>_<scenario>_<expected>`
- **Test each service function independently**

### Frontend
- **Use Vitest** for unit tests
- **Use Testing Library** for component tests
- **Mock API calls** with `msw` (Mock Service Worker)
- **Never test implementation details** — test behavior

---

*Last updated: 2026-07-02*
