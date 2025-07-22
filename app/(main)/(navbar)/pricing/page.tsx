'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, GraduationCap, UserCheck, Award, Building, Book, Users, Zap, Crown, Shield, ArrowRight, ChevronRight } from 'lucide-react';

/* ---------- TYPES ---------- */
interface PricingCardProps {
  tier: string;
  price: number | string;
  features: string[];
  bgColor: string;
  description: string;
  icon: React.ElementType;
  isPopular?: boolean;
  courseId?: string;
  instructorId?: number | null;
  isFree?: boolean;
}

/* ---------- HOOK PLACEHOLDER ---------- */
// Replace this with your actual hook/context
const useUser = () => ({
  userProfile: { id: 'demo-user' }, // stub
});

/* ---------- ENHANCED PRICING CARD ---------- */
const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  features,
  bgColor,
  description,
  icon: Icon,
  isPopular,
  courseId,
  instructorId,
  isFree,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { userProfile } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = async () => {
    if (!userProfile?.id) {
      alert('Please log in to proceed with checkout.');
      return;
    }

    const successUrl = 'https://example.com/order/success';
    const cancelUrl = 'https://example.com/order/cancel';

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: tier.toLowerCase(),
            successUrl,
            cancelUrl,
            userId: userProfile.id,
            courseId: courseId || '1',
            instructorId: instructorId ?? null,
          }),
        }
      );

      const sessionUrl = await res.text();
      window.location.href = sessionUrl;
    } catch (err) {
      console.error(err);
      alert('Failed to create checkout session.');
    }
  };

  const getButtonText = () => {
    if (isFree || price === 0) return 'Get Started Free';
    if (typeof price === 'string') return 'Contact Sales';
    return 'Start Subscription';
  };

  const getButtonStyle = () => {
    if (isPopular) {
      return isHovered
        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl transform -translate-y-1 scale-105'
        : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg';
    }
    if (isFree || price === 0) {
      return isHovered
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl transform -translate-y-1'
        : 'bg-green-500 text-white shadow-md';
    }
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
            {tier}
          </h3>

          <div className="flex items-baseline justify-center mb-4">
            {typeof price === 'string' ? (
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {price}
              </span>
            ) : price === 0 ? (
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE
              </span>
            ) : (
              <>
                <span className="text-2xl font-semibold text-gray-600">₹</span>
                <span className={`text-5xl font-extrabold tracking-tight transition-colors duration-300 ${isPopular ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                  {price.toLocaleString()}
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
        <div className="relative flex-1 bg-white/80 backdrop-blur-sm px-8 py-8">
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

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            className={`group w-full rounded-2xl px-6 py-4 font-bold text-sm transition-all duration-300 ${getButtonStyle()}`}
          >
            <span className="flex items-center justify-center gap-2">
              {getButtonText()}
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''
                }`} />
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 italic">
              {isFree || price === 0
                ? 'No credit card required'
                : 'Cancel anytime • 30-day money back guarantee'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN PAGE ---------- */
export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'learner' | 'faculty'>('learner');

  const learnerPlans: PricingCardProps[] = [
    {
      tier: 'Foundation',
      price: 0,
      description: 'Perfect for exploring our platform',
      features: [
        'Access to public course catalog',
        'Attend one free course',
        'Community forum participation',
        'Basic learning resources',
      ],
      bgColor: 'bg-gradient-to-b from-green-50 to-green-100',
      icon: Book,
      isFree: true,
      courseId: 'foundation-course-id',
      instructorId: null,
    },
    {
      tier: 'Essential',
      price: 849,
      description: 'Ideal for self-paced learners',
      features: [
        'Unlimited course access',
        'Assignment submission & grading',
        'Discussion forums & peer interaction',
        'Downloadable certificates',
        'Progress tracking dashboard',
      ],
      bgColor: 'bg-gradient-to-b from-blue-50 to-blue-100',
      icon: GraduationCap,
      courseId: 'essential-course-id',
      instructorId: null,
    },
    {
      tier: 'Professional',
      price: 1899,
      description: 'Built for working professionals',
      features: [
        'Advanced progress analytics',
        'Direct instructor Q&A sessions',
        'Offline content downloads',
        'Mobile app access',
        'Priority email support',
        'Career guidance resources',
      ],
      bgColor: 'bg-gradient-to-b from-purple-50 to-purple-100',
      icon: Users,
      isPopular: true,
      courseId: 'professional-course-id',
      instructorId: null,
    },
    {
      tier: 'Mastery',
      price: 3799,
      description: 'For serious skill development',
      features: [
        'Live webinar participation',
        'Batch-based collaborative learning',
        'Real-time instructor chat support',
        'Industry-recognized certifications',
        'Personalized learning paths',
        'Job placement assistance',
      ],
      bgColor: 'bg-gradient-to-b from-indigo-50 to-indigo-100',
      icon: Award,
      courseId: 'mastery-course-id',
      instructorId: null,
    },
    {
      tier: 'Institutional',
      price: 'Custom Pricing',
      description: 'Enterprise & academic solutions',
      features: [
        'Bulk user enrollment',
        'Advanced analytics & reporting',
        'Custom learning pathways',
        'Compliance & audit tracking',
        'Dedicated account manager',
        'White-label options',
      ],
      bgColor: 'bg-gradient-to-b from-gray-50 to-gray-100',
      icon: Building,
      courseId: 'institutional-course-id',
      instructorId: null,
    },
  ];

  const facultyPlans: PricingCardProps[] = [
    {
      tier: 'Starter',
      price: 0,
      description: 'Perfect for first-time course creators',
      features: [
        'Create & publish one course',
        'Upload videos, PDFs & presentations',
        'Basic learner progress tracking',
        'Community support access',
      ],
      bgColor: 'bg-gradient-to-b from-green-50 to-green-100',
      icon: Book,
      isFree: true,
      courseId: 'faculty-starter-id',
      instructorId: null,
    },
    {
      tier: 'Educator',
      price: 1299,
      description: 'For independent instructors & tutors',
      features: [
        'Unlimited course creation',
        'Advanced quiz & assessment builder',
        'Automated grading system',
        'Discussion forum management',
        'Student messaging system',
      ],
      bgColor: 'bg-gradient-to-b from-blue-50 to-blue-100',
      icon: UserCheck,
      courseId: 'educator-course-id',
      instructorId: null,
    },
    {
      tier: 'Mentor',
      price: 2599,
      description: 'Designed for subject matter experts',
      features: [
        'Live webinar & session hosting',
        'Bulk certificate generation',
        'Advanced student analytics',
        'Direct learner messaging',
        'Revenue tracking dashboard',
      ],
      bgColor: 'bg-gradient-to-b from-purple-50 to-purple-100',
      icon: Award,
      isPopular: true,
      courseId: 'mentor-course-id',
      instructorId: null,
    },
    {
      tier: 'Institutional',
      price: 4999,
      description: 'Enterprise solution for organizations',
      features: [
        'Multi-role team access management',
        'Institution-wide analytics & reporting',
        'Automated secure backups',
        'Dedicated success manager',
        'Custom branding options',
      ],
      bgColor: 'bg-gradient-to-b from-indigo-50 to-indigo-100',
      icon: Building,
      courseId: 'faculty-institutional-id',
      instructorId: null,
    },
  ];

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

        {/* Pricing Cards Grid - Centered for Faculty */}
        <div className={`grid gap-8 ${activeTab === 'faculty'
            ? 'lg:grid-cols-2 xl:grid-cols-4 max-w-6xl mx-auto'
            : 'lg:grid-cols-3 xl:grid-cols-5'
          }`}>
          {currentPlans.map((tier, index) => (
            <div
              key={tier.tier}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-fade-in-up"
            >
              <PricingCard {...tier} />
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm px-6 py-3 shadow-lg border border-white/20 mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              30-day money-back guarantee • Cancel anytime
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