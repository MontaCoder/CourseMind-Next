import { auth } from "@/lib/auth";
import { BillingActions } from "@/components/billing/billing-actions";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { PricingCard } from "@/components/pricing/pricing-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STRIPE_PLANS, getCourseLimit } from "@/lib/config/constants";
import {
  getUserPlan,
  getUserSubscriptionStatus,
} from "@/lib/queries/subscription-queries";

const UPGRADE_PLANS: Array<"MONTHLY" | "YEARLY"> = ["MONTHLY", "YEARLY"];

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user = await getUserSubscriptionStatus(session.user.id);
  const plan = await getUserPlan(session.user.id);
  const planDetails = STRIPE_PLANS[plan];
  const subscription = user?.subscriptions?.[0];
  const statusLabel = subscription?.status ?? "ACTIVE";
  const hasActiveSubscription = subscription?.status === "ACTIVE";
  const courseCount = user?._count.courses ?? 0;
  const courseLimit = getCourseLimit(plan);
  const nextBillingDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;
  const priceLabel =
    plan === "FREE"
      ? "Free"
      : `$${planDetails.price.toFixed(2)}/${plan === "MONTHLY" ? "mo" : "yr"}`;
  const courseTypeLabel =
    planDetails.courseType === "VIDEO_TEXT" ? "Video + Text" : "Text + Image";

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Track your plan, billing dates, and subscription controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              {plan === "FREE"
                ? "You are on the Free plan."
                : "You are subscribed to a paid plan."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-3xl font-bold">{planDetails.name}</p>
              <p className="text-xl text-muted-foreground">{priceLabel}</p>
            </div>
            <StatusBadge status={statusLabel} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-sm text-muted-foreground mb-1">Next billing</p>
              <p className="font-medium">
                {nextBillingDate ?? "TBD"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-sm text-muted-foreground mb-1">Course usage</p>
              <p className="font-medium">
                {courseCount} / {courseLimit} courses generated
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-sm text-muted-foreground mb-1">Plan limits</p>
              <p className="font-medium">
                {planDetails.limits.courses} courses · {courseTypeLabel}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {planDetails.features.slice(0, 4).map((feature) => (
              <p key={feature} className="text-sm text-muted-foreground truncate">
                • {feature}
              </p>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <BillingActions
            hasActiveSubscription={hasActiveSubscription}
            cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
          />
        </CardFooter>
      </Card>

      {plan === "FREE" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Upgrade to unlock unlimited AI-generated courses and premium support.
            </p>
            <p className="text-xs text-muted-foreground">
              Monthly and yearly plans include advanced AI tutor features and course certificates.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {UPGRADE_PLANS.map((upgradePlan) => (
              <PricingCard
                key={upgradePlan}
                plan={upgradePlan}
                featured={upgradePlan === "MONTHLY"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Use Stripe's customer portal to swap plans, update cards, or reschedule payments.
          </p>
        </div>
      )}
    </div>
  );
}

