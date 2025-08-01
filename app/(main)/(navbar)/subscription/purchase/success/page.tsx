'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Mail, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  showPaymentSuccessWithEmailInfo,
  openEmailClient,
  cleanSessionId,
  isValidSessionId
} from '@/app/components/utils/paymentUtils';
import {
  getUserId,
  CoursePurchase,
  handleCourseCheckoutSuccess,
  getCourseById,
  ApiCourse,
  pollForPaymentNotifications
} from '@/app/components/services/api';

function CoursePurchaseSuccessContent() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [purchase, setPurchase] = useState<CoursePurchase | null>(null);
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Handle both sessionId and session_id parameters to prevent duplication issues
  const rawSessionId = searchParams.get('session_id') || searchParams.get('sessionId');
  const sessionId = cleanSessionId(rawSessionId);

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

    // Validate session ID before processing
    if (!isValidSessionId(sessionId)) {
      console.error('Invalid session ID:', rawSessionId, 'cleaned:', sessionId);
      setStatus('error');
      toast({
        title: "Invalid Session",
        description: "The payment session ID is invalid. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const processPurchaseSuccess = async () => {
      try {
        // Handle course checkout success
        const result = await handleCourseCheckoutSuccess(sessionId, userId);

        if (result && result.purchase) {
          setPurchase(result.purchase);

          // Fetch course details
          try {
            const courseDetails = await getCourseById(result.purchase.courseId.toString());
            setCourse(courseDetails);
          } catch (error) {
            console.error('Failed to fetch course details:', error);
          }

          setStatus('success');
          showPaymentSuccessWithEmailInfo();

          // Poll for payment notifications
          setTimeout(() => {
            pollForPaymentNotifications(userId).then(notifications => {
              notifications.forEach(notification => {
                toast({
                  title: notification.title,
                  description: notification.message,
                });
              });
            }).catch(console.error);
          }, 1000);
        } else {
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Course purchase processing failed:', error);
        setStatus('error');
        toast({
          title: "Purchase Processing Error",
          description: error.message || "There was an issue processing your course purchase.",
          variant: "destructive",
        });
      }
    };

    processPurchaseSuccess();
  }, [sessionId, userId, toast]);

  const handleGoToCourse = () => {
    if (course) {
      router.push(`/courses/${course.courseId}`);
    } else {
      router.push('/courses');
    }
  };

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
              <h2 className="text-2xl font-bold text-gray-900">Processing your purchase...</h2>
              <p className="text-gray-600">Please wait while we activate your course access.</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Purchase Processing Issue</h2>
              <p className="text-gray-600">
                There was an issue processing your course purchase. Please contact support if you believe this is an error.
              </p>
              <div className="space-y-2">
                <Button onClick={handleGoToDashboard} className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push('/courses')} className="w-full">
                  Browse Courses
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
          <CardTitle className="text-3xl font-bold text-gray-900">Course Purchase Successful!</CardTitle>
          <p className="text-gray-600 mt-2">You now have lifetime access to this course.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {purchase && course && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{course.courseName}</h3>
                  <p className="text-gray-600 mt-1">{course.courseDescription}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{course.courseCategory}</Badge>
                    <Badge variant="outline">{course.language}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold">₹{purchase.finalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Purchase Date</p>
                  <p className="font-semibold">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {purchase.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Email Confirmation Sent</AlertTitle>
            <AlertDescription>
              A confirmation email has been sent to your registered email address with your purchase receipt and course access details.
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
            <h4 className="font-semibold text-gray-900">What's Included:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Lifetime access to course content
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                All video lectures and materials
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Assignments and quizzes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Certificate of completion
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Community forum access
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGoToCourse} className="flex-1">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleGoToDashboard} className="flex-1">
              Go to Dashboard
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Need help getting started? Contact our support team anytime.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CoursePurchaseSuccessPage() {
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
              <p className="text-gray-600">Please wait while we load your purchase details.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <CoursePurchaseSuccessContent />
    </Suspense>
  );
}