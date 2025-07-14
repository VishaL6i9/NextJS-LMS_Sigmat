"use client";
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem, User } from '../types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceFormProps {
  invoice: Invoice;
  onInvoiceChange: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onInvoiceChange }) => {
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  const addItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) return;

    const item: InvoiceItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      total: newItem.quantity * newItem.unitPrice,
    };

    const updatedItems = [...invoice.items, item];
    updateInvoiceTotals(updatedItems);
    setNewItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = invoice.items.filter(item => item.id !== itemId);
    updateInvoiceTotals(updatedItems);
  };

  const updateInvoiceTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount - invoice.discount;

    onInvoiceChange({
      ...invoice,
      items,
      subtotal,
      taxAmount,
      total: Math.max(0, total),
    });
  };

  const updateUser = (field: keyof User, value: string) => {
    onInvoiceChange({
      ...invoice,
      user: { ...invoice.user, [field]: value },
    });
  };

  const updateInvoiceField = (field: keyof Invoice, value: any) => {
    const updatedInvoice = { ...invoice, [field]: value };
    
    if (field === 'taxRate' || field === 'discount') {
      const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (updatedInvoice.taxRate / 100);
      const total = subtotal + taxAmount - updatedInvoice.discount;
      updatedInvoice.subtotal = subtotal;
      updatedInvoice.taxAmount = taxAmount;
      updatedInvoice.total = Math.max(0, total);
    }
    
    onInvoiceChange(updatedInvoice);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            type="text"
            value={invoice.invoiceNumber}
            onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
            placeholder="INV-001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={invoice.date}
            onChange={(e) => updateInvoiceField('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={invoice.status} onValueChange={(value) => updateInvoiceField('status', value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              type="text"
              value={invoice.user.name}
              onChange={(e) => updateUser('name', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              type="email"
              value={invoice.user.email}
              onChange={(e) => updateUser('email', e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPhone">Phone</Label>
            <Input
              id="userPhone"
              type="tel"
              value={invoice.user.phone || ''}
              onChange={(e) => updateUser('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userAddress">Address</Label>
            <Input
              id="userAddress"
              type="text"
              value={invoice.user.address || ''}
              onChange={(e) => updateUser('address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Course Items</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                type="text"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Course name or description"
              />
            </div>
            <Input
              type="number"
              value={newItem.quantity || 1}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
              placeholder="Qty"
              min="1"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                value={newItem.unitPrice || 0}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                placeholder="Price"
                min="0"
                step="0.01"
              />
              <Button onClick={addItem} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-md border">
                <div className="flex-1 font-medium">{item.description}</div>
                <div className="w-16 text-center text-sm">{item.quantity}</div>
                <div className="w-24 text-right text-sm">${item.unitPrice.toFixed(2)}</div>
                <div className="w-24 text-right font-medium">${item.total.toFixed(2)}</div>
                <Button onClick={() => removeItem(item.id)} variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={invoice.notes || ''}
            onChange={(e) => updateInvoiceField('notes', e.target.value)}
            placeholder="Additional notes or payment terms..."
          />
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoice.taxRate}
                onChange={(e) => updateInvoiceField('taxRate', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                value={invoice.discount}
                onChange={(e) => updateInvoiceField('discount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
