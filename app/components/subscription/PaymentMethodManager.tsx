'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CreditCard, 
  Trash2, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Lock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Mock data for payment methods
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  bankName?: string;
}

interface PaymentMethodManagerProps {
  userId?: string;
  className?: string;
}

export default function PaymentMethodManager({ userId, className = "" }: PaymentMethodManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        setPaymentMethods([
          {
            id: 'pm_1234567890',
            type: 'card',
            isDefault: true,
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2025,
            brand: 'visa'
          },
          {
            id: 'pm_0987654321',
            type: 'card',
            isDefault: false,
            last4: '1234',
            expiryMonth: 3,
            expiryYear: 2024,
            brand: 'mastercard'
          },
          {
            id: 'ba_1234567890',
            type: 'bank_account',
            isDefault: false,
            last4: '6789',
            bankName: 'Chase'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchPaymentMethods();
  }, []);

  const handleAddPaymentMethod = () => {
    setIsAddingNew(true);
  };

  const handleCancelAddPaymentMethod = () => {
    setIsAddingNew(false);
  };

  const handleSubmitNewPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add new payment method to the list
      const newMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substring(2, 15)}`,
        type: 'card',
        isDefault: false,
        last4: '5678',
        expiryMonth: 9,
        expiryYear: 2026,
        brand: 'amex'
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setIsProcessing(false);
      setIsAddingNew(false);
      
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been added successfully.",
      });
    }, 2000);
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
    
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    const methodToDelete = paymentMethods.find(m => m.id === methodId);
    
    if (methodToDelete?.isDefault) {
      toast({
        title: "Cannot Delete Default Method",
        description: "Please set another payment method as default before deleting this one.",
        variant: "destructive",
      });
      return;
    }
    
    setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
    
    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed successfully.",
    });
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      case 'discover':
        return '💳 Discover';
      default:
        return '💳 Card';
    }
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading payment methods...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-indigo-600" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {paymentMethods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Payment Methods</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You don't have any payment methods saved. Add a payment method to make subscription payments easier.
            </p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              onClick={handleAddPaymentMethod}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`p-4 rounded-lg border ${method.isDefault ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">
                        {method.type === 'card' ? getCardIcon(method.brand) : '🏦 Bank'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type === 'card' 
                            ? `${method.brand} •••• ${method.last4}` 
                            : `${method.bankName} •••• ${method.last4}`}
                        </p>
                        {method.type === 'card' && (
                          <p className="text-sm text-gray-500">
                            Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        )}
                      </div>
                      {method.isDefault && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        disabled={method.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!isAddingNew && (
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2"
                onClick={handleAddPaymentMethod}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Payment Method
              </Button>
            )}
          </motion.div>
        )}
        
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
              
              <form onSubmit={handleSubmitNewPaymentMethod}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          className="pl-10" 
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input 
                        id="cardholderName" 
                        placeholder="John Doe" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input 
                          id="cvv" 
                          placeholder="123" 
                          className="pl-10" 
                          maxLength={4}
                          required
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="setAsDefault"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="setAsDefault" className="ml-2 block text-sm text-gray-700">
                      Set as default payment method
                    </label>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelAddPaymentMethod}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Save Payment Method
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. We use Stripe for secure payment processing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-6">
        <div className="w-full text-sm text-gray-500">
          <p>
            We use Stripe for secure payment processing. Your payment information is never stored on our servers.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}