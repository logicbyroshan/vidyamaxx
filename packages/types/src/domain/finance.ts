/**
 * @vidyafloww/types — Fee & Financial Domain Types
 */

import type { Auditable, UUID } from '../common';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'net_banking' | 'cheque' | 'demand_draft';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type InvoiceStatus = 'paid' | 'unpaid' | 'partially_paid' | 'overdue';

export interface FeeHead extends Auditable {
  name: string;
  code: string;
  description?: string;
  is_recurring: boolean;
}

export interface FeeStructure extends Auditable {
  name: string;
  academic_session_id: UUID;
  class_id: UUID;
  total_amount: number;
  due_date: string;
}

export interface FeeInvoice extends Auditable {
  invoice_number: string;
  student_id: UUID;
  fee_structure_id: UUID;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  status: InvoiceStatus;
}

export interface FeeTransaction extends Auditable {
  transaction_number: string;
  invoice_id: UUID;
  student_id: UUID;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  payment_date: string;
  reference_number?: string;
  receipt_url?: string;
}
