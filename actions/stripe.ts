"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession(plan: "MONTHLY" | "YEARLY") {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const planDetails = STRIPE_PLANS[plan];

    if (!planDetails.priceId) {
      return { error: "Price ID not configured for this plan" };
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      return { error: "You already have an active subscription" };
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan: plan,
        },
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { error: "Failed to create checkout session" };
  }
}

export async function createPortalSession() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get user's Stripe customer ID
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription?.stripeCustomerId) {
      return { error: "No active subscription found" };
    }

    // Create Stripe portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Error creating portal session:", error);
    return { error: "Failed to create portal session" };
  }
}

export async function getUserSubscription() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { subscription };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return { error: "Failed to fetch subscription" };
  }
}

export async function cancelSubscription() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return { error: "No active subscription found" };
    }

    if (!subscription.stripeSubscriptionId) {
      return { error: "Stripe subscription ID not found" };
    }

    // Cancel at period end (user keeps access until end of billing period)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update database
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/billing");
    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { error: "Failed to cancel subscription" };
  }
}

export async function resumeSubscription() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        cancelAtPeriodEnd: true,
      },
    });

    if (!subscription) {
      return { error: "No subscription set to cancel found" };
    }

    if (!subscription.stripeSubscriptionId) {
      return { error: "Stripe subscription ID not found" };
    }

    // Resume subscription by removing cancel_at_period_end
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update database
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/billing");
    return { success: true };
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return { error: "Failed to resume subscription" };
  }
}

export async function changePlan(newPlan: "MONTHLY" | "YEARLY") {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return { error: "No active subscription found" };
    }

    if (!subscription.stripeSubscriptionId) {
      return { error: "Stripe subscription ID not found" };
    }

    const newPlanDetails = STRIPE_PLANS[newPlan];

    if (!newPlanDetails.priceId) {
      return { error: "Price ID not configured for this plan" };
    }

    // Get current subscription from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    // Update subscription with new price
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPlanDetails.priceId,
        },
      ],
      proration_behavior: "always_invoice",
    });

    // Update database
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: newPlan,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/billing");
    return { success: true };
  } catch (error) {
    console.error("Error changing plan:", error);
    return { error: "Failed to change plan" };
  }
}

export async function getBillingData() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get user's subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let paymentMethods: import("stripe").Stripe.PaymentMethod[] = [];
    let invoices: import("stripe").Stripe.Invoice[] = [];
    let defaultPaymentMethod: string | null = null;

    if (subscription?.stripeCustomerId) {
      try {
        // Get payment methods
        const paymentMethodsList = await stripe.paymentMethods.list({
          customer: subscription.stripeCustomerId,
          type: "card",
        });
        paymentMethods = paymentMethodsList.data;

        // Get default payment method from customer
        const customer = await stripe.customers.retrieve(
          subscription.stripeCustomerId
        );
        if (customer && !customer.deleted) {
          defaultPaymentMethod = customer.invoice_settings.default_payment_method as string | null;
        }

        // Get invoices
        const invoicesList = await stripe.invoices.list({
          customer: subscription.stripeCustomerId,
          limit: 12,
        });
        invoices = invoicesList.data;
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
      }
    }

    return {
      subscription,
      paymentMethods,
      invoices,
      defaultPaymentMethod,
    };
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return { error: "Failed to fetch billing data" };
  }
}

export async function addPaymentMethod() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let customerId = subscription?.stripeCustomerId;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Update or create subscription record
      if (subscription) {
        await db.subscription.update({
          where: { id: subscription.id },
          data: { stripeCustomerId: customerId },
        });
      } else {
        await db.subscription.create({
          data: {
            userId: session.user.id,
            stripeCustomerId: customerId,
            plan: "FREE",
            status: "ACTIVE",
          },
        });
      }
    }

    // Create SetupIntent for adding payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    return { clientSecret: setupIntent.client_secret };
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return { error: "Failed to create setup intent" };
  }
}

export async function removePaymentMethod(paymentMethodId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await stripe.paymentMethods.detach(paymentMethodId);

    revalidatePath("/profile/billing");
    return { success: true };
  } catch (error) {
    console.error("Error removing payment method:", error);
    return { error: "Failed to remove payment method" };
  }
}

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription?.stripeCustomerId) {
      return { error: "No customer found" };
    }

    // Update customer's default payment method
    await stripe.customers.update(subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    revalidatePath("/profile/billing");
    return { success: true };
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return { error: "Failed to set default payment method" };
  }
}
