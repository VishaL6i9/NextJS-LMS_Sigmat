import { Invoice, Company } from '../types/invoice';

const STORAGE_KEYS = {
  INVOICES: 'lms_invoices',
  COMPANY: 'lms_company',
  INVOICE_COUNTER: 'lms_invoice_counter',
};

export const storage = {
  // Invoice Management
  getInvoices: (): Invoice[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveInvoice: (invoice: Invoice): void => {
    try {
      const invoices = storage.getInvoices();
      const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
      
      if (existingIndex >= 0) {
        invoices[existingIndex] = invoice;
      } else {
        invoices.push(invoice);
      }
      
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  },

  deleteInvoice: (invoiceId: string): void => {
    try {
      const invoices = storage.getInvoices().filter(inv => inv.id !== invoiceId);
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  },

  // Company Management
  getCompany: (): Company => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY);
      return stored ? JSON.parse(stored) : {
        name: 'Your LMS Company',
        address: '123 Education St, Learning City, LC 12345',
        phone: '+1 (555) 123-4567',
        email: 'admin@yourlms.com',
        website: 'https://www.yourlms.com',
      };
    } catch {
      return {
        name: 'Your LMS Company',
        address: '123 Education St, Learning City, LC 12345',
        phone: '+1 (555) 123-4567',
        email: 'admin@yourlms.com',
        website: 'https://www.yourlms.com',
      };
    }
  },

  saveCompany: (company: Company): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    } catch (error) {
      console.error('Failed to save company:', error);
    }
  },

  // Invoice Number Generation
  getNextInvoiceNumber: (): string => {
    try {
      let counter = parseInt(localStorage.getItem(STORAGE_KEYS.INVOICE_COUNTER) || '0');
      counter++;
      localStorage.setItem(STORAGE_KEYS.INVOICE_COUNTER, counter.toString());
      return `INV-${counter.toString().padStart(4, '0')}`;
    } catch {
      return `INV-0001`;
    }
  },
};