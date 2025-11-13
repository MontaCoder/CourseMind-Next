import { db } from "@/lib/db";

/**
 * Get user with their active subscription and course count
 * Useful for checking subscription limits
 */
export async function getUserSubscriptionStatus(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: { courses: true },
      },
    },
  });
}

/**
 * Get user's active subscription
 */
export async function getActiveSubscription(userId: string) {
  return db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Check if user has an active paid subscription (MONTHLY or YEARLY)
 */
export async function hasActivePaidSubscription(userId: string): Promise<boolean> {
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      plan: {
        in: ["MONTHLY", "YEARLY"],
      },
    },
  });

  return subscription !== null;
}

/**
 * Get subscription plan for a user (defaults to FREE if no active subscription)
 */
export async function getUserPlan(userId: string): Promise<"FREE" | "MONTHLY" | "YEARLY"> {
  const subscription = await getActiveSubscription(userId);
  return (subscription?.plan as "FREE" | "MONTHLY" | "YEARLY") || "FREE";
}

/**
 * Get subscription with customer ID (used for Stripe portal)
 */
export async function getSubscriptionWithCustomerId(userId: string) {
  return db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      plan: true,
      status: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: true,
    },
  });
}
