'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handleCheckoutSuccess, getUserId, CheckoutSuccessResponse } from '@/app/components/services/api';

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<CheckoutSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCheckoutSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found. Please try again.');
        setIsProcessing(false);
        return;
      }

      try {
        const userId = await getUserId();
        const response = await handleCheckoutSuccess(sessionId, userId);
        setSubscriptionData(response);
      } catch (err: any) {
        console.error('Failed to process checkout success:', err);
        setError(err.message || 'Failed to process your subscription. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processCheckoutSuccess();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your subscription...</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Processing Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={() => router.push('/pricing')} className="w-full">
                Back to Pricing
              </Button>
              <Button variant="outline" onClick={() => router.push('/support')} className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Successful!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Welcome to your new learning journey
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {subscriptionData && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Subscription Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Plan:</span>
                  <p className="text-gray-900">{subscriptionData.subscription.subscriptionPlan.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-gray-900">{subscriptionData.subscription.subscriptionPlan.planType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <p className="text-green-600 font-semibold">{subscriptionData.subscription.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Price:</span>
                  <p className="text-gray-900">₹{subscriptionData.subscription.subscriptionPlan.priceInr}/month</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <p className="text-gray-900">
                    {new Date(subscriptionData.subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">End Date:</span>
                  <p className="text-gray-900">
                    {new Date(subscriptionData.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg border border-green-100">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Payment Reference:</strong> {subscriptionData.subscription.paymentReference}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Session ID:</strong> {subscriptionData.sessionId}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Access all premium features immediately
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Explore courses and start learning
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Manage your subscription in your dashboard
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/courses')} 
              className="flex-1"
            >
              Browse Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')} 
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600 text-center">Please wait while we load your subscription details.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}