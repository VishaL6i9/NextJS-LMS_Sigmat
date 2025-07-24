'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApiDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      tests: []
    };

    try {
      // Test 1: Basic connectivity
      const connectivityTest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/users`, {
        method: 'HEAD'
      }).then(res => ({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        ok: res.ok
      })).catch(err => ({
        error: err.message,
        ok: false
      }));

      results.tests.push({
        name: 'Connectivity Test (HEAD)',
        result: connectivityTest
      });

      // Test 2: Get response headers only
      const headersTest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/users`, {
        method: 'GET'
      }).then(async res => {
        const contentLength = res.headers.get('content-length');
        const contentType = res.headers.get('content-type');
        
        return {
          status: res.status,
          contentType,
          contentLength,
          headers: Object.fromEntries(res.headers.entries()),
          ok: res.ok
        };
      }).catch(err => ({
        error: err.message,
        ok: false
      }));

      results.tests.push({
        name: 'Headers Test',
        result: headersTest
      });

      // Test 3: Partial response read
      if (headersTest.ok) {
        const partialTest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/users`)
          .then(async res => {
            const reader = res.body?.getReader();
            if (!reader) return { error: 'No readable stream' };

            const chunks = [];
            let totalLength = 0;
            const maxChunks = 10; // Read first 10 chunks only

            for (let i = 0; i < maxChunks; i++) {
              const { done, value } = await reader.read();
              if (done) break;
              
              chunks.push(value);
              totalLength += value.length;
              
              if (totalLength > 50000) break; // Stop at 50KB
            }

            reader.releaseLock();

            const decoder = new TextDecoder();
            const partialText = decoder.decode(new Uint8Array(chunks.flatMap(chunk => Array.from(chunk))));

            return {
              chunksRead: chunks.length,
              totalLength,
              firstChars: partialText.substring(0, 500),
              lastChars: partialText.substring(Math.max(0, partialText.length - 500)),
              isValidJsonStart: partialText.trim().startsWith('[') || partialText.trim().startsWith('{')
            };
          }).catch(err => ({
            error: err.message
          }));

        results.tests.push({
          name: 'Partial Response Test',
          result: partialTest
        });
      }

    } catch (error) {
      results.error = error.message;
    }

    setDiagnostics(results);
    setLoading(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>API Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runDiagnostics} disabled={loading} className="mb-4">
          {loading ? 'Running Diagnostics...' : 'Run API Diagnostics'}
        </Button>
        
        {diagnostics && (
          <div className="space-y-4">
            <div>
              <strong>Base URL:</strong> {diagnostics.baseUrl}
            </div>
            <div>
              <strong>Timestamp:</strong> {diagnostics.timestamp}
            </div>
            
            {diagnostics.tests.map((test: any, index: number) => (
              <div key={index} className="border p-3 rounded">
                <h4 className="font-semibold">{test.name}</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                  {JSON.stringify(test.result, null, 2)}
                </pre>
              </div>
            ))}
            
            {diagnostics.error && (
              <div className="text-red-600">
                <strong>Error:</strong> {diagnostics.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiDiagnostics;