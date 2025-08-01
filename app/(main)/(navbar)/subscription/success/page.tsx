'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  handlePaymentSuccess, 
  showPaymentSuccessWithEmailInfo,
  openEmailClient 
} from '@/app/components/utils/paymentUtils';
import { getUserId, UserSubscription } from '@/app/components/services/api';

function SubscriptionSuccessContent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        setStatus('error');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!sessionId || !userId) return;

    const processPaymentSuccess = async () => {
      try {
        const subscription = await handlePaymentSuccess(sessionId, userId);
        
        if (subscription) {
          setSubscription(subscription);
          setStatus('success');
          showPaymentSuccessWithEmailInfo();
        } else {
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Payment processing failed:', error);
        setStatus('error');
        toast({
          title: "Payment Processing Error",
          description: error.message || "There was an issue processing your payment.",
          variant: "destructive",
        });
      }
    };

    processPaymentSuccess();
  }, [sessionId, userId, toast]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleOpenEmail = () => {
    openEmailClient();
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Processing your payment...</h2>
              <p className="text-gray-600">Please wait while we activate your subscription.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Processing Issue</h2>
              <p className="text-gray-600">
                There was an issue processing your payment. Please contact support if you believe this is an error.
              </p>
              <div className="space-y-2">
                <Button onClick={handleGoToDashboard} className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push('/pricing')} className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Payment Successful!</CardTitle>
          <p className="text-gray-600 mt-2">Your subscription is now active and ready to use.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {subscription && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-semibold">{subscription.subscriptionPlan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {subscription.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-semibold">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold">₹{subscription.actualPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auto Renew</p>
                  <p className="font-semibold">{subscription.autoRenew ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Email Confirmation Sent</AlertTitle>
            <AlertDescription>
              A confirmation email has been sent to your registered email address with your payment receipt and subscription details.
              <Button 
                variant="link" 
                onClick={handleOpenEmail}
                className="p-0 h-auto ml-2 text-blue-600"
              >
                Open Email
              </Button>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Access all premium features and content
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Explore your personalized dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Start learning with unlimited access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Manage your subscription anytime
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGoToDashboard} className="flex-1">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push('/pricing')} className="flex-1">
              View All Plans
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact our support team anytime.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
              <p className="text-gray-600">Please wait while we load your payment details.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}