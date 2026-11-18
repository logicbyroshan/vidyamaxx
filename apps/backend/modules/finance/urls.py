from django.urls import path
from .views import (
    ChartOfAccountListCreateView,
    FeePaymentCollectView,
    FeeReceiptDetailView,
    FeeReceiptReverseView,
    ScholarshipGrantListCreateView,
    StudentFeeInvoiceListCreateView,
)

urlpatterns = [
    path("invoices/", StudentFeeInvoiceListCreateView.as_view(), name="finance-invoices"),
    path("collect/", FeePaymentCollectView.as_view(), name="finance-collect"),
    path("receipts/<uuid:pk>/", FeeReceiptDetailView.as_view(), name="finance-receipt-detail"),
    path("receipts/<uuid:pk>/reverse/", FeeReceiptReverseView.as_view(), name="finance-receipt-reverse"),
    path("scholarships/", ScholarshipGrantListCreateView.as_view(), name="finance-scholarships"),
    path("accounts/", ChartOfAccountListCreateView.as_view(), name="finance-accounts"),
]
