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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  AlertCircle, 
  ArrowRight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  getUserId, 
  getLearnerPlans, 
  getFacultyPlans, 
  getCurrentUserSubscription, 
  SubscriptionPlan, 
  UserSubscription 
} from "@/app/components/services/api";

interface SubscriptionUpgradeProps {
  userId?: string;
  currentSubscription?: UserSubscription;
  onUpgradeComplete?: () => void;
  className?: string;
}

export default function SubscriptionUpgrade({
  userId: propUserId,
  currentSubscription: propSubscription,
  onUpgradeComplete,
  className = "",
}: SubscriptionUpgradeProps) {
  const [userId, setUserId] = useState<string | null>(propUserId || null);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(propSubscription || null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If userId wasn't provided as prop, fetch it
        const id = propUserId || await getUserId();
        setUserId(id);
        
        // If currentSubscription wasn't provided as prop, fetch it
        let subscription = propSubscription;
        if (!subscription) {
          try {
            subscription = await getCurrentUserSubscription(id);
            setCurrentSubscription(subscription);
          } catch (error) {
            console.log("No active subscription found");
            setCurrentSubscription(null);
          }
        }
        
        // Fetch available plans based on current subscription type
        if (subscription) {
          const planType = subscription.subscriptionPlan.planType;
          const plans = planType === 'LEARNER' 
            ? await getLearnerPlans() 
            : await getFacultyPlans();
          
          // Filter out the current plan
          const filteredPlans = plans.filter(plan => 
            plan.id !== subscription.subscriptionPlan.id
          );
          
          setAvailablePlans(filteredPlans);
        } else {
          // If no subscription, fetch learner plans by default
          const plans = await getLearnerPlans();
          setAvailablePlans(plans);
        }
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [propUserId, propSubscription, toast]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan || !userId) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call the API to upgrade the subscription
      // For now, we'll simulate a successful upgrade
      setTimeout(() => {
        toast({
          title: "Subscription Updated",
          description: `Your subscription has been updated to ${selectedPlan.name}.`,
        });
        
        // Update the current subscription with the new plan
        if (currentSubscription) {
          setCurrentSubscription({
            ...currentSubscription,
            subscriptionPlan: {
              ...selectedPlan,
              planType: currentSubscription.subscriptionPlan.planType,
            }
          });
        }
        
        setIsProcessing(false);
        setSelectedPlan(null);
        
        // Call the onUpgradeComplete callback if provided
        if (onUpgradeComplete) {
          onUpgradeComplete();
        }
      }, 2000);
    } catch (error: any) {
      console.error("Failed to upgrade subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade subscription. Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const isPlanUpgrade = (plan: SubscriptionPlan) => {
    if (!currentSubscription) return true;
    return plan.priceInr > currentSubscription.subscriptionPlan.priceInr;
  };

  const getPlanDifference = (plan: SubscriptionPlan) => {
    if (!currentSubscription) return plan.priceInr;
    return plan.priceInr - currentSubscription.subscriptionPlan.priceInr;
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading subscription options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Change Subscription</CardTitle>
            <CardDescription>Upgrade or downgrade your subscription plan</CardDescription>
          </div>
          <CreditCard className="h-8 w-8 text-indigo-600" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {currentSubscription ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">{currentSubscription.subscriptionPlan.name}</p>
                <p className="text-sm text-gray-600">{currentSubscription.subscriptionPlan.planType} Plan</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(currentSubscription.subscriptionPlan.priceInr)}<span className="text-sm font-normal text-gray-500">/month</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <p className="text-gray-600">You don't have an active subscription plan.</p>
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        
        {availablePlans.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Other Plans Available</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              There are no other subscription plans available for your account type.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availablePlans.map((plan) => {
              const isUpgrade = isPlanUpgrade(plan);
              const priceDifference = getPlanDifference(plan);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border ${
                    selectedPlan?.id === plan.id
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-gray-200 bg-white'
                  } transition-all hover:shadow-md cursor-pointer`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${
                        isUpgrade ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        {isUpgrade ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          {isUpgrade ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Upgrade</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Downgrade</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        
                        <div className="mt-3 space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 3 && (
                            <p className="text-sm text-indigo-600 ml-6">
                              +{plan.features.length - 3} more features
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(plan.priceInr)}<span className="text-sm font-normal text-gray-500">/month</span></p>
                      {currentSubscription && (
                        <p className={`text-sm ${isUpgrade ? 'text-green-600' : 'text-amber-600'}`}>
                          {isUpgrade ? '+' : ''}{formatCurrency(priceDifference)}/month
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedPlan?.id === plan.id && (
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Selected Plan</p>
                          <p className="text-sm text-gray-600">
                            {isUpgrade
                              ? 'You will be charged the difference immediately.'
                              : 'Your plan will be downgraded at the end of your current billing period.'}
                          </p>
                        </div>
                        <Button
                          onClick={handleUpgrade}
                          disabled={isProcessing}
                          className={isUpgrade
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                          }
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {isUpgrade ? 'Upgrade Now' : 'Downgrade Plan'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-6">
        <div className="w-full text-sm text-gray-500">
          <p>
            Need help choosing a plan? <a href="/support" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact our support team</a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}