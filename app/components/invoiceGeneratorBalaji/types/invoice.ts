export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Course {
  id: string;
  name: string;
  price: number;
  duration?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  student: Student;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

export interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}