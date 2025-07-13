"use client";
import React from 'react';
import { Printer } from 'lucide-react';
import { Invoice, Company } from '../types/invoice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface InvoicePreviewProps {
  invoice: Invoice;
  company: Company;
  onPrint: () => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, company, onPrint }) => {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoice Preview</h3>
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <Separator />
      <div id="invoice-content" className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{company.name}</h2>
            <p className="text-sm text-gray-500">{company.address}</p>
            <p className="text-sm text-gray-500">{company.phone}</p>
            <p className="text-sm text-gray-500">{company.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-sm"># {invoice.invoiceNumber}</p>
            <Badge variant={getStatusVariant(invoice.status)} className="mt-2 capitalize">{invoice.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-medium">Bill To:</p>
            <p className="font-bold">{invoice.student.name}</p>
            <p className="text-sm text-gray-500">{invoice.student.email}</p>
            <p className="text-sm text-gray-500">{invoice.student.address}</p>
          </div>
          <div className="space-y-1 text-right">
            <p><span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString()}</p>
            <p><span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-2 font-medium">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h4 className="font-medium mb-2">Notes</h4>
            <p className="text-sm text-gray-500">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
