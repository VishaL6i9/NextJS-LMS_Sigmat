"use client";
import React from 'react';
import { Company } from '../types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanySettingsProps {
  company: Company;
  onCompanyChange: (company: Company) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ company, onCompanyChange }) => {
  const updateField = (field: keyof Company, value: string) => {
    onCompanyChange({ ...company, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            value={company.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Your Company Name"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyAddress">Address</Label>
          <Input
            id="companyAddress"
            type="text"
            value={company.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="123 Business St, City, State 12345"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Phone</Label>
          <Input
            id="companyPhone"
            type="tel"
            value={company.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyEmail">Email</Label>
          <Input
            id="companyEmail"
            type="email"
            value={company.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="contact@yourcompany.com"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyWebsite">Website</Label>
          <Input
            id="companyWebsite"
            type="url"
            value={company.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>
    </div>
  );
};
