'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CoursePurchaseCancelPage() {
  const router = useRouter();

  const handleRetryPurchase = () => {
    router.push('/courses');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    // Implement your support contact logic
    console.log('Opening support...');
  };

  const handleBrowseCourses = () => {
    router.push('/courses');
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
          <CardTitle className="text-3xl font-bold text-gray-900">Course Purchase Cancelled</CardTitle>
          <p className="text-gray-600 mt-2">
            Your course purchase was cancelled and no charges were made to your account.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertTitle>No Problem!</AlertTitle>
            <AlertDescription>
              Your purchase was safely cancelled. You can browse our courses and try again anytime, or contact our support team if you need assistance.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">What would you like to do?</h4>
            
            <div className="grid gap-3">
              <Button onClick={handleBrowseCourses} className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Courses
              </Button>
              
              <Button variant="outline" onClick={handleRetryPurchase} className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Purchase Again
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
            <h5 className="font-semibold text-blue-900">Why Choose Our Courses?</h5>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Expert instructors with industry experience</li>
              <li>• Comprehensive curriculum and hands-on projects</li>
              <li>• Lifetime access to course materials</li>
              <li>• Certificate of completion</li>
              <li>• Community support and discussion forums</li>
              <li>• Regular content updates</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <h5 className="font-semibold text-green-900">Special Offers Available</h5>
            <p className="text-sm text-green-800">
              Check out our current promotions and bundle deals. Save up to 30% on selected courses!
            </p>
            <Button variant="outline" size="sm" onClick={handleBrowseCourses} className="mt-2">
              View Offers
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Questions about our courses or pricing? 
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