# DOCUMENT 09: AUTHENTICATION & DYNAMIC RBAC SPECIFICATION

> **Classification**: `EVIDENCE-BASED SECURITY & ACCESS CONTROL SPECIFICATION`  
> **Source Files**: `core/authentication/`, `core/permissions/`, `common/permissions/responsibility.py`  
> **Core Principle**: Zero Static Roles for Staff — 100% Dynamic Responsibility Scoping  

---

## 1. The 7 Institutional User Personas

VidyaFloww replaces rigid role-based access control with a strict **7-UserType Model** (`User.UserType`):

```
Platform Level:
  ├── SUPER_ADMIN         (Full platform SaaS control; can cancel subscriptions)
  └── SUPER_EXECUTIVE     (Platform operator; BLOCKED from subscription cancellation)

School Governance:
  ├── SCHOOL_ADMIN        (Full institutional control over single school/branches)
  └── SCHOOL_EXECUTIVE    (School administrative officer)

Operational Staff:
  └── STAFF               (Unified faculty, accountant, librarian, clerk, coordinator)
                          -> Has ZERO permissions by default
                          -> Inherits access SOLELY from active StaffResponsibilityAssignment

End Users:
  ├── STUDENT             (Enrolled learner; self-service view)
  └── PARENT              (Guardian; multi-child scoped view)
```

---

## 2. Dynamic Responsibility RBAC Architecture

In traditional systems, assigning a user the role of "Teacher" grants them access to view all students and edit all marks across the entire school. In a school with 3,000 students, this is a major privacy and security violation.

VidyaFloww enforces **Scoped Work Responsibility Assignments**:

### Model Structure (`StaffResponsibilityAssignment`)
```python
class StaffResponsibilityAssignment(TenantScopedModel):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE)
    work_division = models.CharField(max_length=50, choices=WORK_DIVISION_CHOICES)
    submodule = models.CharField(max_length=50, blank=True)
    action = models.CharField(max_length=20, default='READ') # READ, WRITE, APPROVE, MANAGE
    
    # Granular Scope Constraints
    branch = models.ForeignKey(Branch, null=True, blank=True, on_delete=models.CASCADE)
    grade_class = models.ForeignKey(GradeClass, null=True, blank=True, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, null=True, blank=True, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, null=True, blank=True, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, null=True, blank=True, on_delete=models.CASCADE)
    
    # Temporal Expiry
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
```

### Responsibility Evaluation Logic
When a request arrives at any domain endpoint (e.g., `POST /api/v1/examinations/marks/`):
1. The `StaffScopedResponsibilityPermission` class extracts the target entity from the request (e.g., `grade_class_id`, `section_id`, `subject_id`).
2. If `user.user_type in (SUPER_ADMIN, SCHOOL_ADMIN)`, access is granted immediately.
3. If `user.user_type == STAFF`, the engine queries:
   ```python
   assignments = StaffResponsibilityAssignment.objects.filter(
       membership__user=request.user,
       membership__school=request.school,
       work_division='EXAMINATIONS',
       action__in=['WRITE', 'MANAGE'],
       revoked_at__isnull=True,
       valid_from__lte=now
   ).filter(
       models.Q(valid_until__isnull=True) | models.Q(valid_until__gte=now)
   )
   ```
4. It verifies that the teacher's assignment matches the target class, section, and subject. If no matching assignment exists, it returns `403 Forbidden` (`SCOPE_NOT_PERMITTED`).

---

## 3. The 30 Standardized Work Divisions

The platform categorizes all school actions into **30 standardized work divisions**:

1. `ADMISSIONS`: Enquiry management, intake forms, entrance interviews.
2. `STUDENTS`: Bio data, family contacts, enrollment history.
3. `ACADEMICS`: Curricula, grade structures, syllabus milestones.
4. `TIMETABLE`: Bell schedules, room allocations, timetable publishing.
5. `ATTENDANCE`: Roll-call rosters, leave applications, biometric logs.
6. `TEACHING`: Lesson planning, teacher diaries.
7. `HOMEWORK`: Assignment creation, student submission evaluations.
8. `EXAMINATIONS`: Datesheets, marks ledgers, grade locks.
9. `LEARNING_RESOURCES`: Study materials, lecture notes.
10. `ONLINE_CLASSES`: Virtual classroom sessions, WebRTC links.
11. `FEES_FINANCE`: Fee collections, invoice generation, receipts.
12. `DOCUMENTS_CERTIFICATES`: Transfer certificates, ID cards.
13. `LIBRARY`: Book catalog, circulation, overdue tracking.
14. `TRANSPORT`: Vehicle tracking, route mapping, bus stops.
15. `HOSTEL`: Room allotments, mess menus, night roll-calls.
16. `INVENTORY`: Consumables, stationery supplies.
17. `ASSETS_MAINTENANCE`: Fixed assets, depreciation, maintenance tickets.
18. `STAFF_HR`: Faculty directory, shifts, biometric attendance.
19. `STUDENT_HEALTH`: Infirmary visits, vaccinations, emergency medical notes.
20. `COUNSELLING_SUPPORT`: Confidential welfare and guidance records.
21. `COMMUNICATION`: Broadcast circulars, notices.
22. `EVENTS_CALENDAR`: School calendar, sports days, holidays.
23. `STUDENT_ACTIVITIES`: Student clubs, house points.
24. `SURVEYS_POLLS`: Parent and faculty feedback campaigns.
25. `COMPLAINTS_GRIEVANCES`: Grievance helpdesk tickets, SLA escalations.
26. `FRONT_OFFICE`: Reception log, visitor gate passes.
27. `REPORTS_ANALYTICS`: Institutional BI, report generation.
28. `SCHOOL_ADMIN`: General institutional configuration.
29. `COMPLIANCE_RECORDS`: CBSE/RTE regulatory submissions.
30. `SECURITY_AUDIT`: Audit log review, IP whitelisting.

---

## 4. Dual JWT Lifecycle & Reuse Detection

VidyaFloww utilizes asymmetric/HMAC signed JSON Web Tokens (`djangorestframework-simplejwt`):

- **Access Token**: Short lifespan (**15 minutes**). Carries user ID, email, and active school ID.
- **Refresh Token**: Long lifespan (**7 days**). Stored in the database and validated against Redis.
- **Automatic Token Rotation**: Every time `/api/v1/auth/token/refresh/` is called, the old refresh token is blacklisted in Redis and a completely new pair (access + refresh) is issued.
- **Reuse Detection (Token Theft Defense)**: If a previously blacklisted refresh token is presented, the system detects a token reuse attack, immediately invalidates the entire token family, revokes the user's active session, and logs a high-severity `AuditEvent`.

---

## 5. Indian Mobile OTP & Password Recovery Engine

Given Indian K-12 operational realities, many parents do not use email regularly:
- **Phone Number Normalization**: All mobile numbers are validated via `phonenumbers` to E.164 standard (`+91XXXXXXXXXX`).
- **Redis OTP Cache**: OTPs are generated as 6-digit cryptographically secure random integers, stored in Redis with a strict **5-minute Time-To-Live (TTL)**.
- **Rate Limiting**: Maximum 3 OTP requests per phone number per hour to prevent SMS gateway flooding.
- **Forgot Username Flow**: Parents can retrieve their account username by providing their verified phone number and the student's date of birth.
