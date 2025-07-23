'use client';

import React from 'react';
import { 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  Bell, 
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface RenewalNotificationProps {
  subscription: {
    id: number;
    planName: string;
    endDate: string;
    autoRenew: boolean;
    price: number;
    daysRemaining: number;
  };
  onDismiss?: () => void;
  onRenew?: () => void;
  onManage?: () => void;
  className?: string;
}

export default function RenewalNotification({
  subscription,
  onDismiss,
  onRenew,
  onManage,
  className = "",
}: RenewalNotificationProps) {
  const { planName, endDate, autoRenew, price, daysRemaining } = subscription;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Determine the type of notification based on days remaining
  const getNotificationType = () => {
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 3) return 'urgent';
    if (daysRemaining <= 7) return 'warning';
    return 'info';
  };
  
  const notificationType = getNotificationType();
  
  // Determine the background color based on notification type
  const getBgColor = () => {
    switch (notificationType) {
      case 'expired':
        return 'bg-red-50 border-red-200';
      case 'urgent':
        return 'bg-orange-50 border-orange-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  // Determine the icon color based on notification type
  const getIconColor = () => {
    switch (notificationType) {
      case 'expired':
        return 'text-red-600';
      case 'urgent':
        return 'text-orange-600';
      case 'warning':
        return 'text-amber-600';
      default:
        return 'text-blue-600';
    }
  };
  
  // Determine the message based on notification type and auto-renewal status
  const getMessage = () => {
    if (notificationType === 'expired') {
      return 'Your subscription has expired. Renew now to continue accessing premium features.';
    }
    
    if (autoRenew) {
      return `Your subscription will automatically renew on ${formatDate(endDate)}. Your payment method will be charged ₹${price.toLocaleString()}.`;
    }
    
    if (notificationType === 'urgent') {
      return `Your subscription expires in ${daysRemaining} days on ${formatDate(endDate)}. Renew now to avoid losing access.`;
    }
    
    if (notificationType === 'warning') {
      return `Your subscription expires in ${daysRemaining} days on ${formatDate(endDate)}. Consider renewing soon.`;
    }
    
    return `Your subscription will expire on ${formatDate(endDate)}. You can renew anytime before then.`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
    >
      <Alert className={`${getBgColor()} border shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`${getIconColor()} mt-0.5`}>
              {notificationType === 'expired' ? (
                <AlertCircle className="h-5 w-5" />
              ) : autoRenew ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
            </div>
            <div>
              <AlertTitle className="mb-1">
                {notificationType === 'expired'
                  ? 'Subscription Expired'
                  : autoRenew
                  ? 'Automatic Renewal Scheduled'
                  : `Subscription Expires in ${daysRemaining} Days`}
              </AlertTitle>
              <AlertDescription className="text-sm">
                <span className="font-medium">{planName}</span> - {getMessage()}
              </AlertDescription>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 ml-8 sm:ml-0">
            {!autoRenew && notificationType !== 'info' && (
              <Button 
                size="sm" 
                onClick={onRenew}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <CreditCard className="mr-1 h-4 w-4" />
                Renew Now
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onManage}
            >
              Manage
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}