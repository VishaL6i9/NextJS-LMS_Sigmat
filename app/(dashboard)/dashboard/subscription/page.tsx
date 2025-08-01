"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from '@/components/ui/ChevronRight';
import { BellRing as Bell } from '@/components/ui/BellRing';
import {
  CreditCard,
  Settings,
  Loader2,
  Crown,
  Zap,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-6 mx-auto" />
              <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-indigo-600/20 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Loading subscription information...
            </h2>
            <p className="text-gray-600">Please wait while we fetch your data</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 backdrop-blur-sm mb-6">
            <Crown className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Premium Dashboard</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Subscription Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your subscription, payment methods, and billing information with our premium experience
          </p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <TabsList className="grid max-w-4xl grid-cols-4 h-14 p-1 bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
              <TabsTrigger
                key="trigger-overview"
                value="overview"
                className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                key="trigger-payment"
                value="payment"
                className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Payment</span>
              </TabsTrigger>
              <TabsTrigger
                key="trigger-upgrade"
                value="upgrade"
                className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Upgrade</span>
              </TabsTrigger>
              <TabsTrigger
                key="trigger-settings"
                value="settings"
                className="flex items-center gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Settings</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <TabsContent key="tab-overview" value="overview">
                <motion.div
                  key="motion-overview"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <SubscriptionManager userId={userId || undefined} />
                </motion.div>
              </TabsContent>

              <TabsContent key="tab-payment" value="payment">
                <motion.div
                  key="motion-payment"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <PaymentMethodManager userId={userId || undefined} />
                </motion.div>
              </TabsContent>

              <TabsContent key="tab-upgrade" value="upgrade">
                <motion.div
                  key="motion-upgrade"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
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

              <TabsContent key="tab-settings" value="settings">
                <motion.div
                  key="motion-settings"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border-b border-white/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Notification Settings
                          </CardTitle>
                          <CardDescription className="text-gray-600 text-lg mt-2">
                            Manage your subscription notifications and preferences
                          </CardDescription>
                        </div>
                        <div className="relative">
                          <Bell className="h-10 w-10 text-indigo-600" />
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="space-y-6">
                        <motion.div
                          key="payment-reminders-setting"
                          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-green-500/10">
                              <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Payment Reminders</h3>
                              <p className="text-sm text-gray-600">Get notified before your subscription renews</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="paymentReminders"
                              defaultChecked
                              className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                            />
                            <label htmlFor="paymentReminders" className="ml-3 block text-sm font-medium text-gray-700">
                              Enabled
                            </label>
                          </div>
                        </motion.div>

                        <Separator key="separator-1" className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                        <motion.div
                          key="subscription-updates-setting"
                          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-blue-500/10">
                              <Zap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Subscription Updates</h3>
                              <p className="text-sm text-gray-600">Get notified about changes to your subscription</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="subscriptionUpdates"
                              defaultChecked
                              className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                            />
                            <label htmlFor="subscriptionUpdates" className="ml-3 block text-sm font-medium text-gray-700">
                              Enabled
                            </label>
                          </div>
                        </motion.div>

                        <Separator key="separator-2" className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                        <motion.div
                          key="promotional-offers-setting"
                          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-purple-500/10">
                              <Crown className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Promotional Offers</h3>
                              <p className="text-sm text-gray-600">Get notified about special offers and discounts</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="promotionalOffers"
                              defaultChecked={false}
                              className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                            />
                            <label htmlFor="promotionalOffers" className="ml-3 block text-sm font-medium text-gray-700">
                              Enabled
                            </label>
                          </div>
                        </motion.div>
                      </div>

                      <div className="pt-6 border-t border-gray-200/50">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                          Save Notification Settings
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white/20 shadow-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">30-day money-back guarantee</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}