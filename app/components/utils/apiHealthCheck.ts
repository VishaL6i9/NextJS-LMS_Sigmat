export interface HealthCheckResult {
  isHealthy: boolean;
  status: number;
  message: string;
  responseTime: number;
  contentType?: string;
  contentLength?: number;
}

export async function checkApiHealth(baseUrl: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseUrl}/api/public/users`, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      isHealthy: response.ok,
      status: response.status,
      message: response.ok ? 'API is healthy' : `HTTP ${response.status}: ${response.statusText}`,
      responseTime,
      contentType: response.headers.get('content-type') || undefined,
      contentLength: parseInt(response.headers.get('content-length') || '0') || undefined
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      isHealthy: false,
      status: 0,
      message: `Network error: ${error.message}`,
      responseTime
    };
  }
}

export async function validateJsonResponse(url: string): Promise<{
  isValid: boolean;
  error?: string;
  size?: number;
  preview?: string;
}> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        isValid: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const text = await response.text();
    
    try {
      JSON.parse(text);
      return {
        isValid: true,
        size: text.length,
        preview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
      };
    } catch (parseError) {
      return {
        isValid: false,
        error: `JSON Parse Error: ${parseError.message}`,
        size: text.length,
        preview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Network error: ${error.message}`
    };
  }
}