export interface Company {
  id: string;
  company_name: string | null;
  representative_name: string;
  postal_code: string;
  address: string;
  phone: string;
  email: string;
}

export interface PaymentMethod {
  id: string;
  method_type: 'domestic_bank_transfer' | 'international_wire' | 'paypal' | 'other';
  name: string;
  description: string | null;
  is_default: boolean;
  bank_name: string | null;
  branch_name: string | null;
  account_type: string | null;
  account_number: string | null;
  account_holder: string | null;
  swift_code: string | null;
  bank_address: string | null;
  paypal_email: string | null;
  instruction_file_url: string | null;
}

export interface InvoiceData {
  invoiceNumber: string;
  sender: Company | null;
  recipient: Company | null;
  payment_method: PaymentMethod | null;
  issue_date: string | null;
  payment_deadline: string | null;
}

export interface InvoiceItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  type: 'parent_product' | 'child_product' | 'option';
  parentId?: string;
  notes?: string;
  splitRatio?: number;
  remainingAmount?: number;
  groupOrder: number;
  itemOrder: number;
  taxRate?: number;
}

export interface InvoiceDraft {
  id: string;
  title: string;
  sender_id: string | null;
  recipient_id: string | null;
  payment_method_id: string | null;
  issue_date: string | null;
  payment_deadline: string | null;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export type CreateInvoiceDraft = Omit<InvoiceDraft, 'id' | 'created_at' | 'updated_at'>;
export interface UpdateInvoiceDraft extends Partial<CreateInvoiceDraft> {
  id: string;
} 