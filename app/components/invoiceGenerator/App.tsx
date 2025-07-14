"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceForm } from './components/InvoiceForm';


import { CompanySettings } from './components/CompanySettings';
import { useInvoice } from './hooks/useInvoice';
import { Button } from '@/components/ui/button';
import { Plus, Save, ExternalLink } from 'lucide-react';

function App() {
  const {
    currentInvoice,
    setCurrentInvoice,
    company,
    saveInvoice,
    saveCompany,
    createNewInvoice,
    stripeInvoiceUrl, // Get the URL from the hook
  } = useInvoice();

  const handleSaveInvoice = () => {
    saveInvoice();
  };

  const handleViewOnStripe = () => {
    if (stripeInvoiceUrl) {
      window.open(stripeInvoiceUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoice Generator</h1>
            <p className="text-gray-500">Create and manage professional invoices.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={createNewInvoice} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
            <Button onClick={handleSaveInvoice}>
              <Save className="mr-2 h-4 w-4" />
              Save & Create on Stripe
            </Button>
            {stripeInvoiceUrl && (
              <Button onClick={handleViewOnStripe} variant="secondary">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Stripe
              </Button>
            )}
          </div>
        </header>

        <Tabs defaultValue="invoice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="settings">Company Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="invoice">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvoiceForm invoice={currentInvoice} onInvoiceChange={setCurrentInvoice} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                
                
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompanySettings company={company} onCompanyChange={saveCompany} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

export default App;
