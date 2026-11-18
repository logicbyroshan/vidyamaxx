"""
VidyaFloww Production Admin Registrations & Immutable Ledger Guards
"""

from django.contrib import admin
from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerSubscription, CustomerTenant, PlatformInvoice, School, SubscriptionPlan
from core.permissions.models import ResponsibilityAssignmentHistory, SecurityPolicy, StaffResponsibilityAssignment
from core.sessions.models import DeviceSession
from core.users.models import Membership
from modules.academics.models import AcademicMilestone, AcademicSession, ClassSubjectMapping, GradeClass, Section, Subject
from modules.admissions.models import AdmissionApplication, AdmissionEnquiry
from modules.attendance.models import AttendanceCorrectionLog, LeaveApplication, StudentAttendanceRecord
from modules.discipline.models import GrievanceTicket
from modules.examinations.models import ExaminationCycle, StudentExamMark
from modules.finance.models import FeeReceipt, FeeTransaction, ScholarshipGrant, StudentFeeInvoice
from modules.homework.models import HomeworkAssignment
from modules.hr.models import StaffProfile
from modules.lms.models import LessonPlan
from modules.students.models import Guardian, Student, StudentEnrollment
from modules.timetable.models import ProxySubstitution, TimetableEntry
from platform_services.audit.models import AuditEvent
from platform_services.forms.models import SurveyCampaign
from platform_services.reports.models import GeneratedReportRecord, StatutoryComplianceFiling


class ImmutableModelAdmin(admin.ModelAdmin):
    """Prevents editing or deleting immutable audit/financial ledger records in Django Admin."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


def _safe_register(model_cls, admin_cls=None):
    if not admin.site.is_registered(model_cls):
        if admin_cls:
            admin.site.register(model_cls, admin_cls)
        else:
            admin.site.register(model_cls)


class CustomerTenantAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "contact_email", "is_active", "created_at")
    search_fields = ("name", "slug")


class SchoolAdmin(admin.ModelAdmin):
    list_display = ("name", "short_code", "city", "board_affiliation", "active_academic_session_label")
    search_fields = ("name", "short_code", "city")


class BranchAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "school", "city", "is_primary", "status")
    search_fields = ("name", "code")


class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "school", "user_type", "is_active", "created_at")
    list_filter = ("user_type", "is_active")


class StaffResponsibilityAssignmentAdmin(admin.ModelAdmin):
    list_display = ("membership", "work_division", "submodule", "is_active", "valid_until")
    list_filter = ("work_division", "is_active")


class StudentAdmin(admin.ModelAdmin):
    list_display = ("admission_number", "full_name", "class_section_label", "status", "fee_status", "school")
    search_fields = ("admission_number", "full_name", "guardian_phone")


class StudentEnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "academic_session", "grade_class", "section", "enrollment_status")
    list_filter = ("enrollment_status",)


class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("employee_code", "full_name", "designation_title", "department_name", "employment_status")
    search_fields = ("employee_code", "full_name", "email")


class StudentFeeInvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "admission_number", "student_name", "net_assessed_fee_inr", "paid_amount_inr", "due_amount_inr", "status")
    search_fields = ("invoice_number", "admission_number", "student_name")


_safe_register(CustomerTenant, CustomerTenantAdmin)
_safe_register(School, SchoolAdmin)
_safe_register(Student, StudentAdmin)
_safe_register(StudentEnrollment, StudentEnrollmentAdmin)
_safe_register(StaffProfile, StaffProfileAdmin)
_safe_register(StudentFeeInvoice, StudentFeeInvoiceAdmin)

# Register immutable ledgers with ImmutableModelAdmin
for imm_cls in (
    FeeReceipt,
    FeeTransaction,
    AttendanceCorrectionLog,
):
    _safe_register(imm_cls, ImmutableModelAdmin)

# Standard registrations for remaining operational models
for model_cls in (
    SubscriptionPlan,
    CustomerSubscription,
    PlatformInvoice,
    AcademicSession,
    GradeClass,
    Section,
    Subject,
    ClassSubjectMapping,
    AcademicMilestone,
    Guardian,
    AdmissionEnquiry,
    AdmissionApplication,
    TimetableEntry,
    ProxySubstitution,
    StudentAttendanceRecord,
    LeaveApplication,
    LessonPlan,
    HomeworkAssignment,
    ExaminationCycle,
    StudentExamMark,
    ScholarshipGrant,
    SurveyCampaign,
    GrievanceTicket,
    GeneratedReportRecord,
    StatutoryComplianceFiling,
):
    _safe_register(model_cls)
