"use client";
import React from 'react';
import { Printer } from 'lucide-react';
import { Invoice, Company } from '../types/invoice';
import { Button } from '@/components/ui/button';

interface InvoicePreviewProps {
  invoice: Invoice;
  company: Company;
  onPrint: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, company, onPrint }) => {
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
    <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Invoice Preview</h3>
            <Button onClick={onPrint} variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
        </div>
        <div id="invoice-content" className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-2 items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{company.name || 'Your Company'}</h1>
                    <p className="text-gray-500">{company.address || '123 Business St, Suite 100'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-semibold text-gray-700">Invoice</h2>
                    <p className="text-gray-500">#{{invoice.invoiceNumber || 'INV-001'}}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                    <p className="font-semibold text-gray-700">Bill To:</p>
                    <p className="font-bold text-gray-800">{invoice.user.name || 'Client Name'}</p>
                    <p className="text-gray-500">{invoice.user.address || 'Client Address'}</p>
                    <p className="text-gray-500">{invoice.user.email || 'client@email.com'}</p>
                </div>
                <div className="text-right space-y-2">
                    <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <p className="px-3 py-1 inline-block rounded-full bg-green-200 text-green-800 font-semibold">
                        {invoice.status || 'Paid'}
                    </p>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 font-semibold text-gray-600">Description</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Quantity</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Unit Price</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="p-4">{item.description}</td>
                                <td className="p-4 text-center">{item.quantity}</td>
                                <td className="p-4 text-right">${item.unitPrice.toFixed(2)}</td>
                                <td className="p-4 text-right">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 items-start mt-8">
                <div className="text-gray-600">
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm">{invoice.notes || 'Thank you for your business!'}</p>
                </div>
                <div className="space-y-3 text-right">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Tax ({invoice.taxRate}%):</span>
                        <span className="font-semibold">${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Discount:</span>
                        <span className="font-semibold">-${invoice.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t-2 border-gray-200">
                        <span>Total:</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InvoicePreview;
