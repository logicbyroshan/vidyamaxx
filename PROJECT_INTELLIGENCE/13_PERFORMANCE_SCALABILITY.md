# DOCUMENT 13: PERFORMANCE, OPTIMIZATION & SCALABILITY ASSESSMENT

> **Classification**: `EVIDENCE-BASED SCALABILITY ANALYSIS`  
> **Source Baseline**: VidyaFloww Architecture & ORM Query Patterns  

---

## 1. Database Query Optimization & Indexing Strategy

In a large multi-tenant K-12 school ERP serving 500+ schools and hundreds of thousands of students, poorly indexed queries quickly lead to full table scans.

VidyaFloww implements specific indexing strategies:
1. **Compound Multi-Tenant Indexes**: Every tenant-scoped model indexes `school` and common query fields together:
   - `Student`: `index_together = [('school', 'admission_number'), ('school', 'is_active')]`
   - `StudentEnrollment`: `unique_together = ('student', 'academic_session')`, indexed on `('academic_session', 'grade_class', 'section')`.
   - `TimetableEntry`: `index_together = [('academic_session', 'day_of_week', 'period_slot')]`.
2. **N+1 Query Prevention**:
   - DRF ViewSets use `select_related()` for one-to-one and foreign keys (`school`, `academic_session`, `grade_class`, `section`, `student__user`).
   - `prefetch_related()` is used for reverse foreign keys and many-to-many sets (`student__guardians`, `class_subjects`).
3. **Pagination Enforced Universally**:
   - `StandardResultsSetPagination` enforces a default page size of 25 items with a hard limit of `100` items per request, preventing runaway memory exhaustion from unrestricted `SELECT *` calls.

---

## 2. In-Memory Caching Architecture

Caching is implemented via **Redis 7** using a two-tier strategy:

1. **Dashboard & Summary Caching**:
   - `GET /api/v1/analytics/dashboard/` and `GET /api/v1/dashboard/summary/` aggregate institutional counts across students, staff, and attendance.
   - Results are cached in Redis with a 5-minute TTL (`cache_key = f"dash_summary_{school_id}_{session_id}"`).
   - Cache entries are automatically invalidated whenever a student is enrolled, a staff member is added, or daily attendance is finalized.
2. **Permission Assignment Caching**:
   - Active `StaffResponsibilityAssignment` records are cached per `membership_id` to prevent redundant relational joins on every incoming HTTP request.

---

## 3. Asynchronous Offloading Strategy (Celery Workers)

CPU-intensive and I/O-bound operations are strictly prohibited from executing synchronously within the HTTP request/response cycle:

| Workload | Execution Method | Queue | Timeout |
|---|---|---|---|
| **Student ID Card Zip Bundle Export** | Celery Worker (Zipfile + S3 presigned upload) | `reports` | 300s |
| **Custom Report Compilation (PDF/XLSX)** | Celery Worker (`openpyxl` / `reportlab`) | `reports` | 180s |
| **DLT SMS & WhatsApp Message Broadcast** | Celery Worker (Batched external HTTP calls) | `high_priority` | 60s |
| **Biometric Attendance Ingestion & Deduplication** | Celery Worker (Timeseries log processing) | `default` | 120s |
| **Automated Fee Defaulter Reminders** | Celery Beat (Scheduled daily at 08:00 AM IST) | `default` | 600s |

---

## 4. Scalability Bottlenecks & Capacity Limits

### 1. Database Connection Limits (PostgreSQL)
- **Bottleneck**: Django creates a database connection per WSGI worker thread. Under 500 concurrent requests, PostgreSQL can quickly exhaust its `max_connections` (typically 100–300).
- **Mitigation**: Deploy **PgBouncer** in transaction pooling mode between Django and PostgreSQL, allowing 10,000+ client connections to share a pool of 50 physical database sockets.

### 2. High-Concurrency Fee Realization Days
- **Bottleneck**: On the 1st to 10th of each month, thousands of parents attempt to pay school fees simultaneously.
- **Mitigation**: 
  - Payment collection is isolated in `Payments-VidyaFloww`.
  - The payment gateway sends asynchronous webhooks to `/api/v1/integrations/payment/webhook/`.
  - Webhooks verify HMAC signatures and push events onto a Redis queue, processing fee ledger insertions asynchronously with idempotency deduplication.
