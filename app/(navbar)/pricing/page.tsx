"use client";
import React, { useState } from 'react';
import { Check, Sparkles, Book, Users, Cpu } from 'lucide-react';

const PricingCard = ({
                       tier,
                       price,
                       features,
                       bgColor,
                       description,
                       icon: Icon,
                       isPopular
                     }: {
  tier: string;
  price: number;
  features: string[];
  bgColor: string;
  description: string;
  icon: React.ElementType;
  isPopular?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckout = async () => {
    const successUrl = 'https://example.com/order/success';
    const cancelUrl = 'https://example.com/order/cancel';

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier: tier.toLowerCase(),
          successUrl:successUrl,
          cancelUrl:cancelUrl
        })
      });

      const sessionUrl = await response.text();

      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
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
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                Most Popular <Sparkles className="w-4 h-4 ml-1" />
              </div>
            </div>
        )}
        <div className={`flex flex-col rounded-2xl shadow-xl overflow-hidden ${bgColor} border-2 border-transparent transition-all duration-300 ${isHovered ? 'border-indigo-500' : ''}`}>
          <div className="px-6 py-8 sm:p-10 sm:pb-6">
            <div className="flex items-center justify-center mb-4">
              <Icon className={`w-10 h-10 ${isHovered ? 'animate-bounce' : ''}`} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">{tier}</h3>
            <div className="flex justify-center items-baseline">
              <span className="text-3xl font-medium">$</span>
              <span className="text-6xl font-extrabold tracking-tight">{price}</span>
              <span className="text-xl font-medium text-gray-500">/mo</span>
            </div>
            <div className="mt-6 text-center text-gray-600 font-medium">{description}</div>
          </div>
          <div className="flex-1 px-6 pt-6 pb-8 bg-white sm:p-10 sm:pt-6">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-600">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                    <span className="text-base">{feature}</span>
                  </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                  className={`w-full px-6 py-4 text-center rounded-xl font-semibold transition-all duration-300 ${
                      isHovered
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform -translate-y-1'
                          : 'bg-gray-100 text-gray- 800 hover:bg-gray-200'
                  }`}
                  onClick={handleCheckout}
              >
                Buy Now
              </button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 italic">
              Instant setup, satisfied or reimbursed.
            </div>
          </div>
        </div>
      </div>
  );
};

function App() {
  const pricingTiers = [
    {
      tier: "Starter",
      price: 35,
      description: "Perfect for individual learners",
      features: [
        "Access to basic courses",
        "Learning path guidance",
        "Basic progress tracking",
        "Email support"
      ],
      bgColor: "bg-gradient-to-b from-gray-50 to-gray-100",
      icon: Book
    },
    {
      tier: "Professional",
      price: 65,
      description: "Ideal for growing teams",
      features: [
        "All Starter features",
        "Advanced course materials",
        "Team collaboration tools",
        "Priority support"
      ],
      bgColor: "bg-gradient-to-b from-blue-50 to-indigo-100",
      icon: Users,
      isPopular: true
    },
    {
      tier: "Enterprise",
      price: 125,
      description: "For large organizations",
      features: [
        "All Professional features",
        "Custom learning paths",
        "Advanced analytics",
        "24/7 dedicated support"
      ],
      bgColor: "bg-gradient-to-b from-purple-50 to-purple-100",
      icon: Cpu
    }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Choose Your Learning Journey
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Flexible plans designed to help you grow at your own pace
            </p>
          </div>
          <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {pricingTiers.map((tier) => (
                <PricingCard key={tier.tier} {...tier} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-base text-gray-500">
              Need a custom plan? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Contact us</a>
            </p>
          </div>
        </div>
      </div>
  );
}

export default App;