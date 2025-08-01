'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SubscriptionCancelPage() {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push('/pricing');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    router.push('/contact-us')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Payment Cancelled</CardTitle>
          <p className="text-gray-600 mt-2">
            Your payment was cancelled and no charges were made to your account.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertTitle>No Worries!</AlertTitle>
            <AlertDescription>
              Your payment was safely cancelled. You can try again anytime or contact our support team if you need assistance.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">What would you like to do?</h4>

            <div className="grid gap-3">
              <Button onClick={handleRetryPayment} className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Payment Again
              </Button>

              <Button variant="outline" onClick={handleGoHome} className="w-full justify-start">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>

              <Button variant="outline" onClick={handleContactSupport} className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h5 className="font-semibold text-blue-900">Why Choose Our Platform?</h5>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Comprehensive learning management system</li>
              <li>• Expert instructors and quality content</li>
              <li>• Flexible subscription plans</li>
              <li>• 30-day money-back guarantee</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Questions about our plans or pricing?
              <Button variant="link" onClick={handleContactSupport} className="p-0 h-auto ml-1">
                Get in touch with our team
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}