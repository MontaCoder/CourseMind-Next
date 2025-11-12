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
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/billing`,
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
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/billing`,
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
    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { error: "Failed to cancel subscription" };
  }
}
