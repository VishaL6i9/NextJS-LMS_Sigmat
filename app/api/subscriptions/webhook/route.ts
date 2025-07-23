import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Webhook secret for verifying the event
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a success response
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook: ${err.message}`);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handler functions for different event types

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  // Extract metadata from the session
  const metadata = session.metadata || {};
  const planId = metadata.plan_id;
  const userId = metadata.user_id;
  const courseId = metadata.course_id;
  const durationMonths = metadata.duration_months;
  
  if (!planId || !userId) {
    console.error('Missing required metadata in checkout session');
    return;
  }
  
  try {
    // Call your API to create a subscription
    const response = await fetch(`${process.env.API_BASE_URL}/api/subscriptions/checkout/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        userId,
        planId,
        courseId,
        durationMonths,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Subscription created successfully:', data);
  } catch (error) {
    console.error('Failed to create subscription:', error);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);
  
  // Get the subscription ID from the invoice
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
    
    // Extract customer metadata
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (!customer || customer.deleted) return;
    
    // Extract user ID from customer metadata
    const userId = (customer as Stripe.Customer).metadata.user_id;
    if (!userId) return;
    
    // Call your API to update subscription status
    await fetch(`${process.env.API_BASE_URL}/api/subscriptions/webhook/invoice-paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: invoice.id,
        subscriptionId,
        userId,
        amount: invoice.amount_paid,
        status: 'paid',
      }),
    });
    
    // Send a notification to the user
    await sendSubscriptionNotification(userId, 'payment_success', {
      invoiceId: invoice.id,
      amount: invoice.amount_paid / 100, // Convert from cents
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to process invoice payment:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Get the subscription ID from the invoice
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  
  try {
    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
    
    // Extract customer metadata
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (!customer || customer.deleted) return;
    
    // Extract user ID from customer metadata
    const userId = (customer as Stripe.Customer).metadata.user_id;
    if (!userId) return;
    
    // Call your API to update subscription status
    await fetch(`${process.env.API_BASE_URL}/api/subscriptions/webhook/invoice-failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: invoice.id,
        subscriptionId,
        userId,
        amount: invoice.amount_due,
        status: 'failed',
      }),
    });
    
    // Send a notification to the user
    await sendSubscriptionNotification(userId, 'payment_failed', {
      invoiceId: invoice.id,
      amount: invoice.amount_due / 100, // Convert from cents
      date: new Date().toISOString(),
      reason: invoice.last_payment_error?.message || 'Payment method declined',
    });
  } catch (error) {
    console.error('Failed to process invoice payment failure:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    // Extract customer metadata
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (!customer || customer.deleted) return;
    
    // Extract user ID from customer metadata
    const userId = (customer as Stripe.Customer).metadata.user_id;
    if (!userId) return;
    
    // Call your API to update subscription status
    await fetch(`${process.env.API_BASE_URL}/api/subscriptions/webhook/subscription-updated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId: subscription.id,
        userId,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      }),
    });
    
    // If subscription was cancelled but still active until period end
    if (subscription.cancel_at_period_end) {
      await sendSubscriptionNotification(userId, 'subscription_cancelled', {
        subscriptionId: subscription.id,
        endDate: new Date(subscription.current_period_end * 1000).toISOString(),
      });
    }
    
    // If subscription is about to expire (within 7 days)
    const now = Math.floor(Date.now() / 1000);
    const daysUntilExpiration = Math.floor((subscription.current_period_end - now) / (60 * 60 * 24));
    
    if (daysUntilExpiration <= 7 && !subscription.cancel_at_period_end) {
      await sendSubscriptionNotification(userId, 'subscription_expiring_soon', {
        subscriptionId: subscription.id,
        daysRemaining: daysUntilExpiration,
        renewalDate: new Date(subscription.current_period_end * 1000).toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to process subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    // Extract customer metadata
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (!customer || customer.deleted) return;
    
    // Extract user ID from customer metadata
    const userId = (customer as Stripe.Customer).metadata.user_id;
    if (!userId) return;
    
    // Call your API to update subscription status
    await fetch(`${process.env.API_BASE_URL}/api/subscriptions/webhook/subscription-deleted`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId: subscription.id,
        userId,
        status: 'cancelled',
      }),
    });
    
    // Send a notification to the user
    await sendSubscriptionNotification(userId, 'subscription_ended', {
      subscriptionId: subscription.id,
      endDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to process subscription deletion:', error);
  }
}

// Helper function to send notifications
async function sendSubscriptionNotification(userId: string, type: string, data: any) {
  try {
    await fetch(`${process.env.API_BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: 'SYSTEM',
        category: 'ALERT',
        title: getNotificationTitle(type),
        message: getNotificationMessage(type, data),
        priority: type.includes('failed') ? 'HIGH' : 'MEDIUM',
      }),
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

// Helper functions for notification content
function getNotificationTitle(type: string): string {
  switch (type) {
    case 'payment_success':
      return 'Payment Successful';
    case 'payment_failed':
      return 'Payment Failed';
    case 'subscription_cancelled':
      return 'Subscription Cancelled';
    case 'subscription_expiring_soon':
      return 'Subscription Expiring Soon';
    case 'subscription_ended':
      return 'Subscription Ended';
    default:
      return 'Subscription Update';
  }
}

function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case 'payment_success':
      return `Your payment of ₹${data.amount} was successfully processed. Thank you for your subscription!`;
    case 'payment_failed':
      return `Your payment of ₹${data.amount} failed. Reason: ${data.reason}. Please update your payment method.`;
    case 'subscription_cancelled':
      return `Your subscription has been cancelled. You'll still have access until ${new Date(data.endDate).toLocaleDateString()}.`;
    case 'subscription_expiring_soon':
      return `Your subscription will renew in ${data.daysRemaining} days on ${new Date(data.renewalDate).toLocaleDateString()}.`;
    case 'subscription_ended':
      return `Your subscription has ended. To continue accessing premium features, please renew your subscription.`;
    default:
      return 'Your subscription status has been updated.';
  }
}