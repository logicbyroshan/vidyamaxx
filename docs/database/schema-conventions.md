# VidyaFloww — Database Schema Conventions

1. **Primary Keys**: UUID v4 (`id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`).
2. **Base Classes (`common/models/`)**:
   - `TimestampedModel`: `created_at` (indexed), `updated_at`.
   - `TenantScopedModel(TimestampedModel)`: `school` (`ForeignKey('organizations.School', on_delete=models.CASCADE, db_index=True)`), optional `branch` (`ForeignKey('campuses.Branch', null=True, blank=True, on_delete=models.PROTECT)`), `created_by_id`, `updated_by_id`.
   - `SoftDeleteMixin`: `deleted_at`, `deleted_by_id` (used only on master profiles like `Student`, `StaffProfile`; forbidden on financial/audit tables).
3. **Monetary Columns**: `DecimalField(max_digits=12, decimal_places=2)` paired with explicit `currency` ISO code (`INR` default).
4. **Constraints & Indexes**:
   - Composite unique constraints always include `school` (e.g., `UniqueConstraint(fields=['school', 'admission_number'], name='uq_student_school_admno')`).
   - Add `CheckConstraint` for financial non-negativity (`amount >= 0`), valid date spans (`end_date >= start_date`), and percentage bounds (`0 <= pct <= 100`).
5. **Immutable Audit & Ledgers**: Never perform `DELETE` on `FeeTransaction`, `AttendanceCorrectionLog`, `ResponsibilityHistory`, or `AuditEvent`.
6. **JSONB Restraint**: Use PostgreSQL `JSONField` strictly for variable custom-field bags, raw webhook payloads, or audit diffs — never for core relational links.
7. **Migrations Discipline**: Never reset or edit applied migrations on shared/production PostgreSQL instances.
