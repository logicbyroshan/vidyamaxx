"""
Celery background tasks for asynchronous institutional report generation.
"""

from __future__ import annotations

from celery import shared_task


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def generate_scheduled_report_task(self, school_id: str, domain: str = "students", title: str = "Scheduled Snapshot") -> dict:
    from core.organizations.models import School
    from modules.students.models import Student
    from modules.hr.models import StaffProfile
    from modules.attendance.models import StudentAttendanceRecord
    from modules.finance.models import StudentFeeInvoice
    from platform_services.reports.models import GeneratedReportRecord

    school = School.objects.filter(id=school_id).first()
    if not school:
        return {"success": False, "error": "School not found"}

    counts = {
        "students": Student.objects.for_school(school.id).count(),
        "staff": StaffProfile.objects.for_school(school.id).count(),
        "attendance": StudentAttendanceRecord.objects.for_school(school.id).count(),
        "finance": StudentFeeInvoice.objects.for_school(school.id).count(),
    }
    row_count = counts.get(domain.lower(), 0)
    rec = GeneratedReportRecord.objects.create(
        school=school,
        report_code=f"AUTO-{domain[:4].upper()}-{row_count}",
        title=title,
        domain=domain.capitalize(),
        export_format="CSV",
        row_count=row_count,
        generated_by_name="Celery Scheduler",
    )
    return {"success": True, "report_id": str(rec.id), "row_count": row_count}
