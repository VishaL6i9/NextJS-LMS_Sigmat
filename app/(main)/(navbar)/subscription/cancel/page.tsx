'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600">
            <XCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Checkout Cancelled
          </CardTitle>
          <p className="text-gray-600">
            Your subscription checkout was cancelled. No payment was processed.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              What happened?
            </h3>
            <p className="text-sm text-gray-700">
              You cancelled the checkout process or closed the payment window. 
              Your account remains unchanged and no charges were made.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                You can try the checkout process again anytime
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Browse our free content and courses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                Contact support if you experienced any issues
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => router.push('/pricing')} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/courses')} 
              className="w-full"
            >
              Browse Courses
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Contact our support team</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}