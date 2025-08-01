'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Calendar,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getCurrentUserSubscription, 
  UserSubscription,
  getUserId
} from '@/app/components/services/api';
import { refreshSubscriptionData } from '@/app/components/utils/paymentUtils';

interface SubscriptionStatusCardProps {
  className?: string;
  showActions?: boolean;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  className = '',
  showActions = true
}) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    if (userId) {
      fetchSubscriptionData();
    }
  }, [userId]);

  const fetchSubscriptionData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const subscriptionData = await getCurrentUserSubscription(userId);
      setSubscription(subscriptionData);
    } catch (error: any) {
      console.error('Failed to fetch subscription:', error);
      // Don't show error toast for no subscription found
      if (!error.message?.includes('not found')) {
        toast({
          title: "Error",
          description: "Failed to load subscription data.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!userId) return;
    
    setRefreshing(true);
    try {
      const refreshedData = await refreshSubscriptionData(userId);
      setSubscription(refreshedData);
      toast({
        title: "Refreshed",
        description: "Subscription data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription data.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'EXPIRED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading subscription...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No Active Subscription</AlertTitle>
            <AlertDescription>
              You don't have an active subscription. Upgrade to access premium features.
            </AlertDescription>
          </Alert>
          {showActions && (
            <div className="mt-4">
              <Button onClick={() => window.location.href = '/pricing'}>
                View Plans
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(subscription.endDate);
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Status
          </CardTitle>
          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{subscription.subscriptionPlan.name}</h3>
            <p className="text-sm text-gray-600">
              {subscription.subscriptionPlan.planType} Plan
            </p>
          </div>
          <Badge className={`flex items-center gap-1 ${getStatusColor(subscription.status)}`}>
            {getStatusIcon(subscription.status)}
            {subscription.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Start Date</p>
            <p className="font-medium">
              {new Date(subscription.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">End Date</p>
            <p className="font-medium">
              {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Amount Paid</p>
            <p className="font-medium">₹{subscription.actualPrice}</p>
          </div>
          <div>
            <p className="text-gray-600">Auto Renew</p>
            <p className="font-medium">{subscription.autoRenew ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Expiry warnings */}
        {isExpired && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Subscription Expired</AlertTitle>
            <AlertDescription>
              Your subscription expired on {new Date(subscription.endDate).toLocaleDateString()}. 
              Renew now to continue accessing premium features.
            </AlertDescription>
          </Alert>
        )}

        {isExpiringSoon && !isExpired && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Subscription Expiring Soon</AlertTitle>
            <AlertDescription>
              Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. 
              {!subscription.autoRenew && ' Consider enabling auto-renewal.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {(isExpired || isExpiringSoon) && (
              <Button onClick={() => window.location.href = '/pricing'}>
                <Calendar className="mr-2 h-4 w-4" />
                Renew Subscription
              </Button>
            )}
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/subscription'}>
              Manage Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};