'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    getUserId,
    pollForSubscriptionActivation,
    pollForPaymentNotifications,
    getCurrentUserSubscription,
    UserSubscription,
    CoursePurchase,
    handleCourseCheckoutSuccess
} from '@/app/components/services/api';
import { Notification } from '@/app/components/user-notification-dashboard/types/notification';

interface PaymentState {
    isProcessing: boolean;
    subscription: UserSubscription | null;
    notifications: Notification[];
    error: string | null;
}

interface PaymentIntegrationOptions {
    enableNotificationPolling?: boolean;
    pollingInterval?: number;
    maxRetries?: number;
}

export const usePaymentIntegration = (options: PaymentIntegrationOptions = {}) => {
    const {
        enableNotificationPolling = true,
        pollingInterval = 30000, // 30 seconds
        maxRetries = 10
    } = options;

    const [state, setState] = useState<PaymentState>({
        isProcessing: false,
        subscription: null,
        notifications: [],
        error: null
    });

    const [userId, setUserId] = useState<string | null>(null);
    const { toast } = useToast();

    // Initialize user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    // Poll for payment notifications
    useEffect(() => {
        if (!userId || !enableNotificationPolling) return;

        const pollNotifications = async () => {
            try {
                const notifications = await pollForPaymentNotifications(userId);
                if (notifications.length > 0) {
                    setState(prev => ({
                        ...prev,
                        notifications: [...prev.notifications, ...notifications]
                    }));

                    // Show toast for each new notification
                    notifications.forEach(notification => {
                        toast({
                            title: notification.title,
                            description: notification.message,
                            variant: notification.type === 'ERROR' ? 'destructive' : 'default',
                        });
                    });
                }
            } catch (error) {
                console.error('Failed to poll payment notifications:', error);
            }
        };

        const interval = setInterval(pollNotifications, pollingInterval);
        return () => clearInterval(interval);
    }, [userId, enableNotificationPolling, pollingInterval, toast]);

    // Handle subscription payment success
    const handleSubscriptionPaymentSuccess = useCallback(async (sessionId: string): Promise<UserSubscription | null> => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        setState(prev => ({ ...prev, isProcessing: true, error: null }));

        try {
            // Show processing message
            toast({
                title: "Processing Payment",
                description: "Please wait while we activate your subscription...",
            });

            // Poll for subscription activation
            const subscription = await pollForSubscriptionActivation(sessionId, maxRetries);

            if (subscription && subscription.status === 'ACTIVE') {
                setState(prev => ({
                    ...prev,
                    subscription,
                    isProcessing: false
                }));

                toast({
                    title: "Payment Successful! 🎉",
                    description: `Your ${subscription.subscriptionPlan.name} subscription is now active!`,
                });

                // Poll for payment notifications
                setTimeout(async () => {
                    try {
                        const notifications = await pollForPaymentNotifications(userId);
                        setState(prev => ({
                            ...prev,
                            notifications: [...prev.notifications, ...notifications]
                        }));
                    } catch (error) {
                        console.error('Failed to fetch payment notifications:', error);
                    }
                }, 1000);

                return subscription;
            } else {
                throw new Error('Subscription activation failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Payment processing failed';
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: errorMessage
            }));

            toast({
                title: "Payment Processing Error",
                description: errorMessage,
                variant: "destructive",
            });

            throw error;
        }
    }, [userId, maxRetries, toast]);

    // Handle course payment success
    const handleCoursePaymentSuccess = useCallback(async (sessionId: string): Promise<CoursePurchase | null> => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        setState(prev => ({ ...prev, isProcessing: true, error: null }));

        try {
            toast({
                title: "Processing Purchase",
                description: "Please wait while we activate your course access...",
            });

            const result = await handleCourseCheckoutSuccess(sessionId, userId);

            if (result && result.purchase) {
                setState(prev => ({ ...prev, isProcessing: false }));

                toast({
                    title: "Purchase Successful! 🎉",
                    description: "You now have lifetime access to this course!",
                });

                // Poll for payment notifications
                setTimeout(async () => {
                    try {
                        const notifications = await pollForPaymentNotifications(userId);
                        setState(prev => ({
                            ...prev,
                            notifications: [...prev.notifications, ...notifications]
                        }));
                    } catch (error) {
                        console.error('Failed to fetch payment notifications:', error);
                    }
                }, 1000);

                return result.purchase;
            } else {
                throw new Error('Course purchase processing failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Purchase processing failed';
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: errorMessage
            }));

            toast({
                title: "Purchase Processing Error",
                description: errorMessage,
                variant: "destructive",
            });

            throw error;
        }
    }, [userId, toast]);

    // Refresh subscription data
    const refreshSubscription = useCallback(async (): Promise<UserSubscription | null> => {
        if (!userId) return null;

        try {
            const subscription = await getCurrentUserSubscription(userId);
            setState(prev => ({ ...prev, subscription }));
            return subscription;
        } catch (error) {
            console.error('Failed to refresh subscription:', error);
            return null;
        }
    }, [userId]);

    // Clear notifications
    const clearNotifications = useCallback(() => {
        setState(prev => ({ ...prev, notifications: [] }));
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Handle payment errors with retry logic
    const handlePaymentError = useCallback((error: any, retryAction?: () => void) => {
        const errorMessages: Record<string, string> = {
            'card_declined': 'Your card was declined. Please try a different payment method.',
            'insufficient_funds': 'Insufficient funds. Please check your account balance.',
            'expired_card': 'Your card has expired. Please update your payment method.',
            'processing_error': 'There was an error processing your payment. Please try again.',
            'network_error': 'Network error. Please check your connection and try again.'
        };

        const userMessage = errorMessages[error.code] || error.message || 'An unexpected error occurred.';

        setState(prev => ({ ...prev, error: userMessage }));

        toast({
            title: "Payment Failed",
            description: userMessage,
            variant: "destructive"
        });
    }, [toast]);

    return {
        // State
        isProcessing: state.isProcessing,
        subscription: state.subscription,
        notifications: state.notifications,
        error: state.error,
        userId,

        // Actions
        handleSubscriptionPaymentSuccess,
        handleCoursePaymentSuccess,
        refreshSubscription,
        clearNotifications,
        clearError,
        handlePaymentError,

        // Utilities
        showPaymentProcessing: () => {
            toast({
                title: "Processing Payment",
                description: "Please wait while we process your payment...",
            });
        },

        showPaymentSuccess: (message?: string) => {
            toast({
                title: "Payment Successful! 🎉",
                description: message || "Your payment has been processed successfully.",
            });
        },

        showEmailConfirmation: () => {
            toast({
                title: "Email Confirmation Sent",
                description: "A confirmation email has been sent to your registered email address.",
            });
        }
    };
};