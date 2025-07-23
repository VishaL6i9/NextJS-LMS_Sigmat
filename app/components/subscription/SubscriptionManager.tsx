'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  XCircle, 
  ArrowUpRight, 
  Download, 
  Bell, 
  BellOff 
} from "lucide-react";
import { 
  getUserId, 
  getCurrentUserSubscription, 
  getAllUserSubscriptions, 
  cancelSubscription, 
  UserSubscription 
} from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SubscriptionManagerProps {
  userId?: string;
  showHistory?: boolean;
  className?: string;
}

export default function SubscriptionManager({ 
  userId: propUserId, 
  showHistory = true,
  className = "" 
}: SubscriptionManagerProps) {
  const [userId, setUserId] = useState<string | null>(propUserId || null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [renewalNotifications, setRenewalNotifications] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // If userId wasn't provided as prop, fetch it
        const id = propUserId || await getUserId();
        setUserId(id);
        
        // Fetch current subscription
        try {
          const current = await getCurrentUserSubscription(id);
          setCurrentSubscription(current);
        } catch (error) {
          console.log("No active subscription found");
          setCurrentSubscription(null);
        }
        
        // Fetch subscription history if needed
        if (showHistory) {
          try {
            const history = await getAllUserSubscriptions(id);
            setSubscriptionHistory(history || []);
          } catch (error) {
            console.error("Failed to fetch subscription history:", error);
            setSubscriptionHistory([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [propUserId, showHistory, toast]);

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    if (!confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.")) {
      return;
    }
    
    setIsCancelling(true);
    try {
      await cancelSubscription(currentSubscription.id);
      
      // Refresh subscription data
      if (userId) {
        const updated = await getCurrentUserSubscription(userId);
        setCurrentSubscription(updated);
        
        if (showHistory) {
          const history = await getAllUserSubscriptions(userId);
          setSubscriptionHistory(history || []);
        }
      }
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully. You'll have access until the end of your billing period.",
      });
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const toggleRenewalNotifications = () => {
    setRenewalNotifications(!renewalNotifications);
    toast({
      title: renewalNotifications ? "Notifications Disabled" : "Notifications Enabled",
      description: renewalNotifications 
        ? "You will no longer receive renewal notifications." 
        : "You will now receive renewal notifications.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Cancelled</Badge>;
      case 'EXPIRED':
        return <Badge variant="secondary" className="bg-gray-200 text-gray-700">Expired</Badge>;
      case 'PENDING':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading subscription information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Subscription Management</CardTitle>
            <CardDescription>Manage your subscription plans and billing</CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-indigo-600" />
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            {showHistory && <TabsTrigger value="history">Subscription History</TabsTrigger>}
          </TabsList>
        </div>

        <TabsContent value="current" className="p-6">
          {currentSubscription ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {currentSubscription.subscriptionPlan.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentSubscription.subscriptionPlan.planType} Plan
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ₹{currentSubscription.subscriptionPlan.priceInr.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                    <div className="mt-1">{getStatusBadge(currentSubscription.status)}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{formatDate(currentSubscription.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{formatDate(currentSubscription.endDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">
                        {getRemainingDays(currentSubscription.endDate)} days remaining
                      </p>
                      <p className="text-sm text-blue-600">
                        {currentSubscription.autoRenew 
                          ? "Your subscription will automatically renew" 
                          : "Your subscription will not renew automatically"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    <span>Renewal Notifications</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleRenewalNotifications}
                    className="flex items-center gap-2"
                  >
                    {renewalNotifications ? (
                      <>
                        <BellOff className="h-4 w-4" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        Enable
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-indigo-600" />
                    <span>Download Invoice</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling || currentSubscription.status === 'CANCELLED'}
                  >
                    {isCancelling ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        {currentSubscription.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Subscription'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You don't have an active subscription plan. Subscribe to a plan to access premium features.
              </p>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                onClick={() => window.location.href = '/pricing'}
              >
                View Subscription Plans
              </Button>
            </motion.div>
          )}
        </TabsContent>

        {showHistory && (
          <TabsContent value="history" className="p-6">
            {subscriptionHistory.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table>
                  <TableCaption>Your subscription history</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionHistory.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">
                          {subscription.subscriptionPlan.name}
                          {subscription.courseId && (
                            <span className="text-xs text-gray-500 block">
                              Course-specific
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>{formatDate(subscription.startDate)}</TableCell>
                        <TableCell>{formatDate(subscription.endDate)}</TableCell>
                        <TableCell className="text-right">
                          ₹{subscription.actualPrice.toLocaleString()}
                          {subscription.discountApplied > 0 && (
                            <span className="text-xs text-green-600 block">
                              Saved ₹{subscription.discountApplied.toLocaleString()}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Subscription History</h3>
                <p className="text-gray-500 mb-6">
                  You don't have any previous subscriptions.
                </p>
              </motion.div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <CardFooter className="bg-gray-50 border-t p-6">
        <div className="w-full text-sm text-gray-500">
          <p>
            Need help with your subscription? <a href="/support" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact support</a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}