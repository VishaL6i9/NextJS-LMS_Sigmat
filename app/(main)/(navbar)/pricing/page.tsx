'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, GraduationCap, UserCheck, Award, Building, Book, Users, Zap, Crown, Shield, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { getLearnerPlans, getFacultyPlans, createPlatformSubscriptionCheckout, SubscriptionPlan, StripeCheckoutRequest, getUserId } from '@/app/components/services/api';
import { useToast } from '@/hooks/use-toast';

/* ---------- TYPES ---------- */
interface PricingCardProps extends SubscriptionPlan {
  bgColor: string;
  icon: React.ElementType;
  isPopular?: boolean;
}

/* ---------- HOOK PLACEHOLDER ---------- */
const useUser = () => {
  const [userProfile, setUserProfile] = useState<{ id: string | null }>({ id: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await getUserId();
        setUserProfile({ id: userId });
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        setUserProfile({ id: null });
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return { userProfile, loading };
};

/* ---------- ENHANCED PRICING CARD ---------- */
const PricingCard: React.FC<PricingCardProps> = ({
  id,
  name,
  priceInr,
  features,
  bgColor,
  description,
  icon: Icon,
  isPopular,
  minimumDurationMonths,
  customPricing,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { userProfile, loading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = async () => {
    if (!userProfile?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive",
      });
      return;
    }

    if (customPricing) {
      // Handle custom pricing logic, e.g., redirect to a contact form
      toast({
        title: "Custom Pricing",
        description: "Please contact our sales team for custom pricing options.",
      });
      return;
    }

    if (priceInr === 0) {
      // Handle free plan - could directly create subscription or redirect to dashboard
      toast({
        title: "Free Plan Activated",
        description: "You now have access to the free plan features!",
      });
      // You might want to create a free subscription here or redirect to dashboard
      return;
    }

    setIsProcessing(true);

    const checkoutData: StripeCheckoutRequest = {
      planId: id,
      durationMonths: minimumDurationMonths,
      successUrl: `${window.location.origin}/subscription/success`,
      cancelUrl: `${window.location.origin}/subscription/cancel`,
    };

    try {
      const response = await createPlatformSubscriptionCheckout(userProfile.id, checkoutData);
      // Redirect to Stripe Checkout
      window.location.href = response.sessionUrl;
    } catch (err: any) {
      console.error('Checkout failed:', err);
      toast({
        title: "Checkout Failed",
        description: err.message || 'Failed to initiate checkout. Please try again.',
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (customPricing) return 'Contact Sales';
    if (priceInr === 0) return 'Get Started Free';
    return 'Start Subscription';
  };

  const getButtonStyle = () => {
    if (isProcessing) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }

    if (isPopular) {
      return isHovered
        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl transform -translate-y-1 scale-105'
        : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg';
    }
    if (customPricing) {
      return isHovered
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl transform -translate-y-1'
        : 'bg-green-500 text-white shadow-md';
    }
    // Free tier and regular tiers use the same styling
    return isHovered
      ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl transform -translate-y-1'
      : 'bg-gray-700 text-white shadow-md hover:bg-gray-800';
  };

  return (
    <div
      className={`relative transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${isHovered ? 'scale-105 -translate-y-2' : ''} ${isPopular ? 'lg:-mt-6 z-10' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg animate-pulse">
            <Crown className="h-4 w-4" />
            Most Popular
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}

      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ${isPopular
          ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200'
          : 'bg-white border border-gray-200'
          } ${isHovered
            ? isPopular
              ? 'border-purple-400 shadow-purple-200/50'
              : 'border-indigo-300 shadow-indigo-100/50'
            : ''
          }`}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''
          } bg-gradient-to-br ${isPopular
            ? 'from-purple-100/50 via-indigo-100/50 to-blue-100/50'
            : 'from-gray-50/50 to-indigo-50/50'
          }`} />

        {/* Header Section */}
        <div className="relative px-8 py-10">
          <div className="mb-6 flex items-center justify-center">
            <div className={`rounded-2xl p-4 transition-all duration-300 ${isHovered ? 'animate-pulse scale-110' : ''
              } ${isPopular
                ? 'bg-gradient-to-br from-purple-100 to-indigo-100'
                : 'bg-gradient-to-br from-gray-100 to-indigo-100'
              }`}>
              <Icon className={`h-8 w-8 transition-colors duration-300 ${isPopular ? 'text-purple-600' : 'text-indigo-600'
                }`} />
            </div>
          </div>

          <h3 className={`mb-4 text-center text-2xl font-bold transition-colors duration-300 ${isPopular ? 'text-purple-900' : 'text-gray-900'
            }`}>
            {name}
          </h3>

          <div className="flex items-baseline justify-center mb-4">
            {customPricing ? (
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Custom
              </span>
            ) : priceInr === 0 ? (
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE
              </span>
            ) : (
              <>
                <span className="text-2xl font-semibold text-gray-600">₹</span>
                <span className={`text-5xl font-extrabold tracking-tight transition-colors duration-300 ${isPopular ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                  {priceInr.toLocaleString()}
                </span>
                <span className="ml-2 text-lg font-medium text-gray-500">/month</span>
              </>
            )}
          </div>

          <p className="text-center text-gray-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Section */}
        <div className="relative flex-1 bg-white/80 backdrop-blur-sm px-8 py-8 flex flex-col justify-between">
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li
                key={index}
                className={`flex items-start space-x-3 text-gray-700 transition-all duration-300 delay-${index * 100} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Check className={`h-5 w-5 transition-colors duration-300 ${isPopular ? 'text-purple-500' : 'text-green-500'
                    }`} />
                </div>
                <span className="text-sm font-medium leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {/* CTA Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || loading}
              className={`group w-full rounded-2xl px-6 py-4 font-bold text-sm transition-all duration-300 ${getButtonStyle()}`}
            >
              <span className="flex items-center justify-center gap-2">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {getButtonText()}
                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </>
                )}
              </span>
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 italic">
                {customPricing || priceInr === 0
                  ? 'No credit card required'
                  : 'Cancel anytime • 30-day money back guarantee'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN PAGE ---------- */
export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'learner' | 'faculty'>('learner');
  const [learnerPlans, setLearnerPlans] = useState<PricingCardProps[]>([]);
  const [facultyPlans, setFacultyPlans] = useState<PricingCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const learnerPlansData = await getLearnerPlans();
        const facultyPlansData = await getFacultyPlans();

        const learnerPlansWithUI: PricingCardProps[] = learnerPlansData.map(plan => ({
          ...plan,
          bgColor: getPlanBgColor(plan.learnerTier),
          icon: getPlanIcon(plan.learnerTier),
          isPopular: plan.learnerTier === 'PROFESSIONAL',
        }));

        const facultyPlansWithUI: PricingCardProps[] = facultyPlansData.map(plan => ({
          ...plan,
          bgColor: getPlanBgColor(plan.facultyTier),
          icon: getPlanIcon(plan.facultyTier),
          isPopular: plan.facultyTier === 'MENTOR',
        }));

        setLearnerPlans(learnerPlansWithUI);
        setFacultyPlans(facultyPlansWithUI);
      } catch (error: any) {
        console.error("Failed to fetch pricing plans:", error);
        toast({
          title: "Error Loading Plans",
          description: error.message || "Failed to load subscription plans. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const getPlanBgColor = (tier: string | null) => {
    switch (tier) {
      case 'FOUNDATION':
      case 'STARTER':
        return 'bg-gradient-to-b from-green-50 to-green-100';
      case 'ESSENTIAL':
      case 'EDUCATOR':
        return 'bg-gradient-to-b from-blue-50 to-blue-100';
      case 'PROFESSIONAL':
      case 'MENTOR':
        return 'bg-gradient-to-b from-purple-50 to-purple-100';
      case 'MASTERY':
        return 'bg-gradient-to-b from-indigo-50 to-indigo-100';
      case 'INSTITUTIONAL':
        return 'bg-gradient-to-b from-gray-50 to-gray-100';
      default:
        return 'bg-gradient-to-b from-gray-50 to-gray-100';
    }
  };

  const getPlanIcon = (tier: string | null) => {
    switch (tier) {
      case 'FOUNDATION':
      case 'STARTER':
        return Book;
      case 'ESSENTIAL':
        return GraduationCap;
      case 'EDUCATOR':
        return UserCheck;
      case 'PROFESSIONAL':
        return Users;
      case 'MENTOR':
        return Award;
      case 'MASTERY':
        return Award;
      case 'INSTITUTIONAL':
        return Building;
      default:
        return Book;
    }
  };

  const currentPlans = activeTab === 'learner' ? learnerPlans : facultyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-2 text-sm font-semibold text-indigo-700 mb-6">
            <Zap className="h-4 w-4" />
            Flexible Learning Solutions
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent sm:text-6xl lg:text-7xl mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Unlock your potential with our comprehensive learning management system.
            Designed for both learners and educators.
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="relative flex rounded-2xl bg-white/80 backdrop-blur-sm p-2 shadow-xl border border-white/20">
            <div
              className={`absolute top-2 bottom-2 rounded-xl bg-gradient-to-r transition-all duration-300 ease-out ${activeTab === 'learner'
                ? 'from-indigo-500 to-purple-600 left-2 right-1/2 mr-1'
                : 'from-purple-500 to-indigo-600 left-1/2 right-2 ml-1'
                }`}
            />
            <button
              onClick={() => setActiveTab('learner')}
              className={`relative z-10 flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300 ${activeTab === 'learner'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <GraduationCap className="h-5 w-5" />
              For Learners
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`relative z-10 flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300 ${activeTab === 'faculty'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <UserCheck className="h-5 w-5" />
              For Faculty
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-xl text-indigo-800 font-medium">Loading subscription plans...</p>
          </div>
        ) : (
          /* Pricing Cards Grid - Centered for Faculty */
          <div className={`grid gap-8 items-stretch ${activeTab === 'faculty'
            ? 'lg:grid-cols-2 xl:grid-cols-4 max-w-6xl mx-auto'
            : 'lg:grid-cols-3 xl:grid-cols-5'
            }`}>
            {currentPlans.map((plan, index) => (
              <div
                key={plan.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in-up h-full"
              >
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm px-6 py-3 shadow-lg border border-white/20 mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Flexible Subscriptions • Cancel anytime
            </span>
          </div>
          <p className="text-base text-gray-600 mb-4">
            All subscription plans include a 3-month minimum commitment period.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-500">Need a custom solution?</span>
            <a
              href="#"
              className="group inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              Contact our sales team
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}