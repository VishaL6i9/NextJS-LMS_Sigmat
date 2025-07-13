import { useState, useCallback } from 'react';
import { Invoice, Company } from '../types/invoice';
import { storage } from '../utils/storage';

export const useInvoice = () => {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(() => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    return {
      id: Date.now().toString(),
      invoiceNumber: storage.getNextInvoiceNumber(),
      date: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      student: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      items: [],
      subtotal: 0,
      taxRate: 8.5,
      taxAmount: 0,
      discount: 0,
      total: 0,
      status: 'draft',
      notes: '',
    };
  });

  const [company, setCompany] = useState<Company>(() => storage.getCompany());

  const saveInvoice = useCallback(() => {
    storage.saveInvoice(currentInvoice);
  }, [currentInvoice]);

  const saveCompany = useCallback((newCompany: Company) => {
    setCompany(newCompany);
    storage.saveCompany(newCompany);
  }, []);

  const createNewInvoice = useCallback(() => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    setCurrentInvoice({
      id: Date.now().toString(),
      invoiceNumber: storage.getNextInvoiceNumber(),
      date: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      student: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      items: [],
      subtotal: 0,
      taxRate: 8.5,
      taxAmount: 0,
      discount: 0,
      total: 0,
      status: 'draft',
      notes: '',
    });
  }, []);

  const printInvoice = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const invoiceElement = document.getElementById('invoice-content');
      if (invoiceElement) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${currentInvoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .invoice-content { max-width: 800px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f5f5f5; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .mb-4 { margin-bottom: 16px; }
                .mb-8 { margin-bottom: 32px; }
                .bg-gray-50 { background-color: #f9f9f9; padding: 16px; border-radius: 8px; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="invoice-content">
                ${invoiceElement.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }, [currentInvoice.invoiceNumber]);

  return {
    currentInvoice,
    setCurrentInvoice,
    company,
    saveInvoice,
    saveCompany,
    createNewInvoice,
    printInvoice,
  };
};