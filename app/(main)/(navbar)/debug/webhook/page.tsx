'use client';

import { WebhookDebugger } from '@/app/components/debug/WebhookDebugger';

export default function WebhookDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Webhook Debug Tool
          </h1>
          <p className="text-gray-600">
            Debug Stripe webhook processing and payment success flow issues
          </p>
        </div>
        
        <WebhookDebugger />
        
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">How to Use This Tool</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900">1. Get Session ID</h3>
                <p>After completing a test payment in Stripe, copy the session ID from the URL or Stripe dashboard.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">2. Get User ID (Optional)</h3>
                <p>Enter the user ID to test subscription-related endpoints. You can find this in your user dashboard or database.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">3. Run Debug</h3>
                <p>Click the debug button to test all webhook and payment processing endpoints.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">4. Analyze Results</h3>
                <p>Check which tests pass/fail to identify where the webhook processing is breaking down.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}