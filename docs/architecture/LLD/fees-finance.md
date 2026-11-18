# Low-Level Design (LLD) — Fees, Scholarships, Accounting & Payment Engine (`modules.finance`, `modules.accounting`, `integrations.payment`)

- **Work Division**: `#11 Fees & Finance` (`fees_finance`)
- **Frontend**: `Payments-VidyaFloww` (standalone) + `apps/web/src/routes/students.tsx` (Student 360 Fees & Scholarships tabs)

## 1. Domain Models
1. **`ChartOfAccount` (`accounting_chart_of_account`)**:
   - School-scoped general ledger head (`code`, `name`, `account_type`: `ASSET` | `LIABILITY` | `INCOME` | `EXPENSE`, `balance_inr`).
2. **`FeeStructure` (`finance_fee_structure`)**:
   - Per-class/session fee schedule (`academic_session`, `grade_class_label`, `base_tuition_inr`, `lab_tech_fee_inr`, `transport_fee_inr`, `library_fee_inr`, `annual_total_inr`).
3. **`ScholarshipGrant` (`finance_scholarship_grant`)**:
   - Student concession/scholarship (`student`, `admission_number`, `student_name`, `scheme_name`, `category`, `waiver_pct`, `waiver_amount_inr`, `funding_agency`, `sanction_ref`, `status`: `Pending` | `Active Disbursed` | `Revoked`).
4. **`StudentFeeInvoice` (`finance_student_invoice`)**:
   - Student fee assessment (`invoice_number`, `student`, `admission_number`, `student_name`, `class_section_label`, `gross_fee_inr`, `scholarship_relief_inr`, `net_assessed_fee_inr`, `paid_amount_inr`, `due_amount_inr`, `status`: `Cleared` | `Pending` | `Overdue`).
5. **`FeeReceipt` (`finance_fee_receipt`) & `FeeTransaction` (`finance_fee_transaction`)**:
   - Append-only financial ledger entries (`receipt_number`, `invoice`, `admission_number`, `student_name`, `amount_inr`, `payment_mode`, `transaction_type`: `CREDIT_COLLECTION` | `DEBIT_REVERSAL`, `status`: `ISSUED` | `REVERSED`, `reversal_reason`, `reversed_by_id`, `idempotency_key`).

## 2. Financial Integrity Rules (Master Prompt Part 10.6)
1. **Immutability**: `FeeReceipt` and `FeeTransaction` rows cannot be deleted or have their `amount_inr` overwritten once created (`403 IMMUTABLE_FINANCIAL_RECORD`).
2. **Controlled Reversal**: Voiding a receipt (`POST /api/v1/finance/receipts/<uuid:pk>/reverse/`) atomically:
   - Marks `receipt.status = "REVERSED"`,
   - Creates a compensating `FeeTransaction(transaction_type="DEBIT_REVERSAL", amount_inr=-receipt.amount_inr)`,
   - Recalculates `invoice.paid_amount_inr` and `invoice.due_amount_inr`, and
   - Emits an immutable `AuditEvent(category="Finance", action="FEE_RECEIPT_REVERSED")`.
3. **Webhook Idempotency**: Payment gateway callbacks (`POST /api/v1/finance/webhooks/payment/`) enforce uniqueness on `idempotency_key` so duplicate webhook deliveries are safely acknowledged without double-crediting.
