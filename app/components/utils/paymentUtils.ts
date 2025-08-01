import { toast } from '@/hooks/use-toast';
import {
    pollForPaymentNotifications,
    handleCheckoutSuccess,
    getCurrentUserSubscription,
    UserSubscription
} from '@/app/components/services/api';

// Clean and validate Stripe session ID to prevent duplication issues
export function cleanSessionId(sessionId: string | null): string | null {
    if (!sessionId) return null;

    // Remove any URL fragment that might have been appended
    if (sessionId.includes('#')) {
        sessionId = sessionId.substring(0, sessionId.indexOf('#'));
    }
    
    // Remove any query parameters that might have been appended
    if (sessionId.includes('?')) {
        sessionId = sessionId.substring(0, sessionId.indexOf('?'));
    }

    // If the session ID appears to be duplicated, take only the first part
    if (sessionId.length > 66 && sessionId.startsWith('cs_')) {
        const secondOccurrence = sessionId.indexOf('cs_', 8);
        if (secondOccurrence > 0) {
            sessionId = sessionId.substring(0, secondOccurrence);
        }
    }

    return sessionId.trim();
}

// Validate Stripe session ID format and length
export function isValidSessionId(sessionId: string | null): boolean {
    if (!sessionId || sessionId.trim().length === 0) {
        return false;
    }

    const cleaned = cleanSessionId(sessionId);
    if (!cleaned) return false;

    // Stripe session IDs should start with cs_ and be at most 66 characters
    return cleaned.startsWith('cs_') && cleaned.length <= 66;
}



// Payment success handling with proper checkout success endpoint
export async function handlePaymentSuccess(sessionId: string, userId: string): Promise<UserSubscription | null> {
    try {

        if (!isValidSessionId(sessionId)) {
            throw new Error(`Invalid session ID: ${sessionId}`);
        }
        // Show loading state
        showPaymentProcessing();

        console.log(`Starting payment success handling for session ${sessionId})`);

        // Call the checkout success endpoint
        const checkoutResponse = await handleCheckoutSuccess(sessionId!, userId);

        if (checkoutResponse && checkoutResponse.subscription) {
            const subscription = checkoutResponse.subscription;

            if (subscription.status === 'ACTIVE') {
                showPaymentSuccessMessage(subscription);

                // Poll for payment notifications
                setTimeout(() => {
                    pollForPaymentNotifications(userId).then(notifications => {
                        notifications.forEach(notification => {
                            showNotificationToast(notification);
                        });
                    }).catch(console.error);
                }, 1000);

                return subscription;
            } else {
                console.log('Subscription not active yet, trying fallback polling');
                // If subscription is not active yet, try polling for a short time
                return await pollForSubscriptionActivationFallback(userId, 5);
            }
        } else {
            console.log('No checkout response, trying direct subscription check');
            // Fallback: try to get current subscription directly
            const subscription = await getCurrentUserSubscription(userId);
            if (subscription && subscription.status === 'ACTIVE') {
                showPaymentSuccessMessage(subscription);
                return subscription;
            }

            showPaymentPendingMessage();
            return null;
        }
    } catch (error: any) {
        console.error('Payment success handling failed:', error);

        // Enhanced fallback: try multiple approaches
        try {
            console.log('Trying fallback subscription check');
            const subscription = await getCurrentUserSubscription(userId);
            if (subscription && subscription.status === 'ACTIVE') {
                console.log('Fallback successful, subscription found');
                showPaymentSuccessMessage(subscription);
                return subscription;
            }
        } catch (fallbackError) {
            console.error('Fallback subscription check failed:', fallbackError);
        }

        showPaymentErrorMessage(error.message || 'Payment processing failed');
        throw error;
    }
}

// Fallback polling for subscription activation using current user subscription
export async function pollForSubscriptionActivationFallback(userId: string, maxAttempts: number = 5): Promise<UserSubscription | null> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const subscription = await getCurrentUserSubscription(userId);

            if (subscription && subscription.status === 'ACTIVE') {
                return subscription;
            }

            // Wait 2 seconds before next attempt
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('Error polling subscription status:', error);
        }
    }

    // Don't throw error, just return null to indicate timeout
    console.warn('Subscription activation polling timed out');
    return null;
}

// Legacy function for backward compatibility - now uses the correct approach
export async function pollForSubscriptionActivation(sessionId: string, maxAttempts: number = 10): Promise<UserSubscription> {
    // This function is deprecated and should not be used
    // It's kept for backward compatibility but will throw an error
    throw new Error('pollForSubscriptionActivation is deprecated. Use handlePaymentSuccess instead.');
}

// Payment retry logic
export async function retryPayment(sessionId: string, maxRetries: number = 3): Promise<any> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await processPayment(sessionId);
            if (result.success) {
                return result;
            }
        } catch (error: any) {
            if (attempt === maxRetries) {
                throw error;
            }

            // Wait before retry (exponential backoff)
            await new Promise(resolve =>
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
        }
    }
}

// Error handling for different payment error types
export function handlePaymentError(error: any) {
    const errorMessages: Record<string, string> = {
        'card_declined': 'Your card was declined. Please try a different payment method.',
        'insufficient_funds': 'Insufficient funds. Please check your account balance.',
        'expired_card': 'Your card has expired. Please update your payment method.',
        'processing_error': 'There was an error processing your payment. Please try again.',
        'network_error': 'Network error. Please check your connection and try again.'
    };

    const userMessage = errorMessages[error.code] || error.message || 'An unexpected error occurred.';

    showErrorModal({
        title: 'Payment Failed',
        message: userMessage,
        actions: [
            { text: 'Try Again', action: () => retryPayment(error.sessionId) },
            { text: 'Contact Support', action: () => openSupportChat() }
        ]
    });
}

// UI Helper Functions
export function showPaymentProcessing() {
    toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
    });
}

export function showPaymentSuccessMessage(subscription?: UserSubscription) {
    toast({
        title: "Payment Successful! 🎉",
        description: subscription
            ? `Your ${subscription.subscriptionPlan.name} subscription is now active!`
            : "Your payment has been processed successfully.",
    });
}

export function showPaymentPendingMessage() {
    toast({
        title: "Payment Processing",
        description: "Your payment is being processed. You'll receive a confirmation shortly.",
    });
}

export function showPaymentErrorMessage(message: string) {
    toast({
        title: "Payment Failed",
        description: message,
        variant: "destructive",
    });
}

export function showSubscriptionActivatedMessage() {
    toast({
        title: "Subscription Activated",
        description: "Your subscription has been successfully activated!",
    });
}

// Notification toast display
export function showNotificationToast(notification: any) {
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${notification.type.toLowerCase()}`;
    toastElement.innerHTML = `
    <div class="toast-icon">${getNotificationIcon(notification.category)}</div>
    <div class="toast-content">
      <h4>${notification.title}</h4>
      <p>${notification.message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

    document.body.appendChild(toastElement);

    // Auto-remove after 5 seconds
    setTimeout(() => toastElement.remove(), 5000);
}

// Get notification icon based on category
function getNotificationIcon(category: string): string {
    switch (category) {
        case 'ASSIGNMENT': return '📝';
        case 'GRADE': return '📊';
        case 'ANNOUNCEMENT': return '📢';
        case 'SYSTEM': return '⚙️';
        case 'REMINDER': return '⏰';
        case 'PAYMENT': return '💳';
        default: return '🔔';
    }
}

// Error modal display
function showErrorModal(options: {
    title: string;
    message: string;
    actions: Array<{ text: string; action: () => void }>;
}) {
    // This would typically use your app's modal system
    // For now, using a simple alert
    alert(`${options.title}: ${options.message}`);
}

// Support chat opener
function openSupportChat() {
    // Implement your support chat opening logic
    console.log('Opening support chat...');
}

// Placeholder for payment processing
async function processPayment(sessionId: string): Promise<{ success: boolean }> {
    // This would integrate with your actual payment processing
    return { success: true };
}

// Subscription status refresh
export async function refreshSubscriptionData(userId: string): Promise<UserSubscription | null> {
    try {
        const subscription = await getCurrentUserSubscription(userId);

        // Show activation message if recently activated
        if (subscription && (subscription as any).recentlyActivated) {
            showSubscriptionActivatedMessage();
        }

        return subscription;
    } catch (error) {
        console.error('Error refreshing subscription:', error);
        return null;
    }
}

// Email confirmation helper
export function showPaymentSuccessWithEmailInfo() {
    toast({
        title: "Payment Successful! 🎉",
        description: "A confirmation email has been sent to your registered email address.",
    });
}

export function openEmailClient() {
    // Try to open default email client
    window.location.href = 'mailto:';
}