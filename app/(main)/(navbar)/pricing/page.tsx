'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Star, Book, Users, Cpu, Sparkles } from 'lucide-react';

/* ---------- TYPES ---------- */
interface Feature {
  option: string;
  icon: React.ElementType;
  isPopular?: boolean;
  courseId?: string;
  instructorId?: number | null;
}

interface PricingCardProps extends Feature {
  tier: string;
  price: number;
  bgColor: string;
  description: string;
}

/* ---------- HOOK PLACEHOLDER ---------- */
// Replace this with your actual hook/context
const useUser = () => ({
  userProfile: { id: 'demo-user' }, // stub
});

/* ---------- PRICING CARD ---------- */
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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userProfile } = useUser();

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

  return (
    <div
      className={`relative transform transition-all duration-300 ease-in-out ${
        isHovered ? 'scale-105' : ''
      } ${isPopular ? 'lg:-mt-4' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1 text-sm font-medium text-white">
            Most Popular <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col overflow-hidden rounded-2xl shadow-xl ${bgColor} border-2 border-transparent transition-all duration-300 ${
          isHovered ? 'border-indigo-500' : ''
        }`}
      >
        <div className="px-6 py-8 sm:p-10 sm:pb-6">
          <div className="mb-4 flex items-center justify-center">
            <Icon className={`h-10 w-10 ${isHovered ? 'animate-bounce' : ''}`} />
          </div>
          <h3 className="mb-4 text-center text-2xl font-bold">{tier}</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-medium">$</span>
            <span className="text-6xl font-extrabold tracking-tight">{price}</span>
            <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
          </div>
          <p className="mt-6 text-center text-gray-600 font-medium">{description}</p>
        </div>

        <div className="flex-1 bg-white px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-center space-x-3 text-gray-600">
                <Check className="h-5 w-5 shrink-0 text-green-500" />
                <span className="text-base">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <button
              onClick={handleCheckout}
              className={`w-full rounded-xl px-6 py-4 font-semibold transition-all duration-300 ${
                isHovered
                  ? 'translate-y-[-2px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Buy Now
            </button>
          </div>

          <p className="mt-6 text-center text-sm italic text-gray-500">
            Instant setup, satisfied or reimbursed.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAIN PAGE ---------- */
export default function PricingPage() {
  const pricingTiers: PricingCardProps[] = [
    {
      tier: 'Starter',
      price: 35,
      description: 'Perfect for individual learners',
      features: [
        'Access to basic courses',
        'Learning path guidance',
        'Basic progress tracking',
        'Email support',
      ],
      bgColor: 'bg-gradient-to-b from-gray-50 to-gray-100',
      icon: Book,
      courseId: 'starter-course-id',
      instructorId: null,
    },
    {
      tier: 'Professional',
      price: 65,
      description: 'Ideal for growing teams',
      features: [
        'All Starter features',
        'Advanced course materials',
        'Team collaboration tools',
        'Priority support',
      ],
      bgColor: 'bg-gradient-to-b from-blue-50 to-indigo-100',
      icon: Users,
      isPopular: true,
      courseId: 'professional-course-id',
      instructorId: null,
    },
    {
      tier: 'Enterprise',
      price: 125,
      description: 'For large organizations',
      features: [
        'All Professional features',
        'Custom learning paths',
        'Advanced analytics',
        '24/7 dedicated support',
      ],
      bgColor: 'bg-gradient-to-b from-purple-50 to-purple-100',
      icon: Cpu,
      courseId: 'enterprise-course-id',
      instructorId: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Learning Journey
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Flexible plans designed to help you grow at your own pace
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.tier} {...tier} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Need a custom plan?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}