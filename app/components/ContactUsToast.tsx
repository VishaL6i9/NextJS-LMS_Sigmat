"use client";
import React from 'react';
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const ContactUsToast: React.FC = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    const showToast = () => {
      toast({
        title: "Have a question?",
        description: "We're here to help!",
        action: (
          <ToastAction altText="Contact us via form" asChild>
            <Link href="/contact-us">Contact Us</Link>
          </ToastAction>
        ),
        duration: 5000, // Show for 5 seconds
      });
    };

    // Show toast after a short delay, e.g., 2 seconds after page load
    const timer = setTimeout(showToast, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  return null; // This component doesn't render anything directly
};

export default ContactUsToast;
