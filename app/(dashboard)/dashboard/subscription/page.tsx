'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Settings, 
  History, 
  ArrowUpRight, 
  Bell, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserId, getCurrentUserSubscription, UserSubscription } from '@/app/components/services/api';
import { useToast } from '@/hooks/use-toast';

// Import subscription components
import SubscriptionManager from '@/app/components/subscription/SubscriptionManager';
import PaymentMethodManager from '@/app/components/subscription/PaymentMethodManager';
import RenewalNotification from '@/app/components/subscription/RenewalNotification';
import SubscriptionUpgrade from '@/app/components/subscription/SubscriptionUpgrade';

export default function SubscriptionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userId, setUserId] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRenewalNotification, setShowRenewalNotification] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
        
        try {
          const subscription = await getCurrentUserSubscription(id);
          setCurrentSubscription(subscription);
        } catch (error) {
          console.log("No active subscription found");
          setCurrentSubscription(null);
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
  }, [toast]);

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Loading subscription information...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Dashboard</h1>
        <p className="text-lg text-gray-600">Manage your subscription, payment methods, and billing information</p>
      </motion.div>

      {currentSubscription && showRenewalNotification && (
        <RenewalNotification
          subscription={{
            id: currentSubscription.id,
            planName: currentSubscription.subscriptionPlan.name,
            endDate: currentSubscription.endDate,
            autoRenew: currentSubscription.autoRenew,
            price: currentSubscription.subscriptionPlan.priceInr,
            daysRemaining: getRemainingDays(currentSubscription.endDate),
          }}
          onDismiss={() => setShowRenewalNotification(false)}
          onRenew={() => setActiveTab('upgrade')}
          onManage={() => setActiveTab('overview')}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment Methods</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden sm:inline">Change Plan</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SubscriptionManager userId={userId || undefined} />
            </motion.div>
          </TabsContent>

          <TabsContent value="payment">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentMethodManager userId={userId || undefined} />
            </motion.div>
          </TabsContent>

          <TabsContent value="upgrade">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SubscriptionUpgrade 
                userId={userId || undefined} 
                currentSubscription={currentSubscription || undefined}
                onUpgradeComplete={() => {
                  setActiveTab('overview');
                  toast({
                    title: "Subscription Updated",
                    description: "Your subscription has been updated successfully.",
                  });
                }}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
                      <CardDescription>Manage your subscription notifications</CardDescription>
                    </div>
                    <Bell className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Payment Reminders</h3>
                        <p className="text-sm text-gray-600">Get notified before your subscription renews</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="paymentReminders"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="paymentReminders" className="ml-2 block text-sm text-gray-700">
                          Enabled
                        </label>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Subscription Updates</h3>
                        <p className="text-sm text-gray-600">Get notified about changes to your subscription</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="subscriptionUpdates"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="subscriptionUpdates" className="ml-2 block text-sm text-gray-700">
                          Enabled
                        </label>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Promotional Offers</h3>
                        <p className="text-sm text-gray-600">Get notified about special offers and discounts</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="promotionalOffers"
                          defaultChecked={false}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="promotionalOffers" className="ml-2 block text-sm text-gray-700">
                          Enabled
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full sm:w-auto">Save Notification Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}