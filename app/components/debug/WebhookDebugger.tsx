'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { debugWebhookStatus, checkWebhookStatus, handleCheckoutSuccess, getCurrentUserSubscription } from '@/app/components/services/api';

export function WebhookDebugger() {
  const [sessionId, setSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const debugWebhook = async () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID');
      return;
    }

    setIsLoading(true);
    setResults(null);

    const debugResults: any = {
      sessionId,
      userId,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Check webhook status
      console.log('Testing webhook status...');
      try {
        const webhookStatus = await checkWebhookStatus(sessionId);
        debugResults.tests.webhookStatus = {
          success: true,
          data: webhookStatus,
          message: webhookStatus.processed ? 'Webhook processed' : 'Webhook not processed'
        };
      } catch (error: any) {
        debugResults.tests.webhookStatus = {
          success: false,
          error: error.message,
          message: 'Webhook status check failed'
        };
      }

      // Test 2: Debug webhook details
      console.log('Getting webhook debug info...');
      try {
        const debugInfo = await debugWebhookStatus(sessionId);
        debugResults.tests.webhookDebug = {
          success: true,
          data: debugInfo,
          message: 'Webhook debug info retrieved'
        };
      } catch (error: any) {
        debugResults.tests.webhookDebug = {
          success: false,
          error: error.message,
          message: 'Webhook debug info not available'
        };
      }

      // Test 3: Try checkout success (if userId provided)
      if (userId.trim()) {
        console.log('Testing checkout success...');
        try {
          const checkoutResponse = await handleCheckoutSuccess(sessionId, userId);
          debugResults.tests.checkoutSuccess = {
            success: true,
            data: checkoutResponse,
            message: 'Checkout success endpoint working'
          };
        } catch (error: any) {
          debugResults.tests.checkoutSuccess = {
            success: false,
            error: error.message,
            message: 'Checkout success endpoint failed'
          };
        }

        // Test 4: Get current user subscription
        console.log('Testing current subscription...');
        try {
          const subscription = await getCurrentUserSubscription(userId);
          debugResults.tests.currentSubscription = {
            success: true,
            data: subscription,
            message: subscription ? `Subscription status: ${subscription.status}` : 'No active subscription'
          };
        } catch (error: any) {
          debugResults.tests.currentSubscription = {
            success: false,
            error: error.message,
            message: 'Current subscription check failed'
          };
        }
      }

      setResults(debugResults);
    } catch (error: any) {
      console.error('Debug failed:', error);
      setResults({
        ...debugResults,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (test: any) => {
    if (!test) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (test.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (test: any) => {
    if (!test) return <Badge variant="secondary">Not Run</Badge>;
    if (test.success) return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Stripe Webhook Debugger</CardTitle>
        <p className="text-sm text-gray-600">
          Debug webhook processing and payment success flow issues
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Session ID (Required)
            </label>
            <Input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="cs_test_..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              User ID (Optional)
            </label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="123"
              className="w-full"
            />
          </div>
        </div>

        <Button 
          onClick={debugWebhook} 
          disabled={isLoading || !sessionId.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Debug Tests...
            </>
          ) : (
            'Debug Webhook & Payment Flow'
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Debug Session:</strong> {results.sessionId} at {new Date(results.timestamp).toLocaleString()}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Webhook Status Test */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Webhook Status</CardTitle>
                    {getStatusIcon(results.tests.webhookStatus)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.tests.webhookStatus)}
                    <p className="text-sm text-gray-600">
                      {results.tests.webhookStatus?.message || 'Not tested'}
                    </p>
                    {results.tests.webhookStatus?.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(results.tests.webhookStatus.data, null, 2)}
                      </pre>
                    )}
                    {results.tests.webhookStatus?.error && (
                      <p className="text-xs text-red-600">
                        Error: {results.tests.webhookStatus.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Webhook Debug Test */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Webhook Debug</CardTitle>
                    {getStatusIcon(results.tests.webhookDebug)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.tests.webhookDebug)}
                    <p className="text-sm text-gray-600">
                      {results.tests.webhookDebug?.message || 'Not tested'}
                    </p>
                    {results.tests.webhookDebug?.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(results.tests.webhookDebug.data, null, 2)}
                      </pre>
                    )}
                    {results.tests.webhookDebug?.error && (
                      <p className="text-xs text-red-600">
                        Error: {results.tests.webhookDebug.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Success Test */}
              {userId && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Checkout Success</CardTitle>
                      {getStatusIcon(results.tests.checkoutSuccess)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getStatusBadge(results.tests.checkoutSuccess)}
                      <p className="text-sm text-gray-600">
                        {results.tests.checkoutSuccess?.message || 'Not tested'}
                      </p>
                      {results.tests.checkoutSuccess?.data && (
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(results.tests.checkoutSuccess.data, null, 2)}
                        </pre>
                      )}
                      {results.tests.checkoutSuccess?.error && (
                        <p className="text-xs text-red-600">
                          Error: {results.tests.checkoutSuccess.error}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Subscription Test */}
              {userId && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Current Subscription</CardTitle>
                      {getStatusIcon(results.tests.currentSubscription)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getStatusBadge(results.tests.currentSubscription)}
                      <p className="text-sm text-gray-600">
                        {results.tests.currentSubscription?.message || 'Not tested'}
                      </p>
                      {results.tests.currentSubscription?.data && (
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(results.tests.currentSubscription.data, null, 2)}
                        </pre>
                      )}
                      {results.tests.currentSubscription?.error && (
                        <p className="text-xs text-red-600">
                          Error: {results.tests.currentSubscription.error}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Full Debug Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Full Debug Output</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}