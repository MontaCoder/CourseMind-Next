"use client";

import { useState } from "react";
import { Subscription } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { STRIPE_PLANS } from "@/lib/stripe";
import { cancelSubscription, resumeSubscription } from "@/actions/stripe";
import { toast } from "sonner";

interface CurrentPlanSectionProps {
  subscription: Subscription | null;
}

export function CurrentPlanSection({ subscription }: CurrentPlanSectionProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const handleCancel = async () => {
    setIsCanceling(true);
    const result = await cancelSubscription();

    if (result.error) {
      toast.error("Failed to cancel", {
        description: result.error,
      });
    } else {
      toast.success("Subscription canceled", {
        description: "Your subscription will remain active until the end of your billing period.",
      });
      setTimeout(() => window.location.reload(), 1000);
    }

    setIsCanceling(false);
  };

  const handleResume = async () => {
    setIsResuming(true);
    const result = await resumeSubscription();

    if (result.error) {
      toast.error("Failed to resume", {
        description: result.error,
      });
    } else {
      toast.success("Subscription resumed", {
        description: "Your subscription will continue automatically.",
      });
      setTimeout(() => window.location.reload(), 1000);
    }

    setIsResuming(false);
  };

  const plan = subscription?.plan || "FREE";
  const planDetails = STRIPE_PLANS[plan];
  const isActive = subscription?.status === "ACTIVE";
  const isCanceled = subscription?.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </div>
          <Badge
            variant={isActive && !isCanceled ? "default" : "secondary"}
            className="ml-auto"
          >
            {isActive && !isCanceled
              ? "Active"
              : isCanceled
              ? "Canceling"
              : subscription?.status || "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{planDetails.name}</h3>
            <p className="text-muted-foreground">
              ${planDetails.price}
              {plan !== "FREE" && (
                <span>/{plan === "MONTHLY" ? "month" : "year"}</span>
              )}
            </p>
          </div>
        </div>

        {subscription?.currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {isCanceled ? "Access until" : "Renews on"}{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        )}

        {isCanceled && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Subscription Canceling
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                Your subscription will end on{" "}
                {subscription.currentPeriodEnd &&
                  new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                You&apos;ll still have access until then.
              </p>
            </div>
          </div>
        )}

        {isActive && !isCanceled && plan !== "FREE" && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Subscription Active</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your subscription is active and will automatically renew.
              </p>
            </div>
          </div>
        )}

        {plan === "FREE" && (
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-sm text-muted-foreground">
              You&apos;re currently on the free plan. Upgrade to unlock premium features.
            </p>
          </div>
        )}

        {isActive && !isCanceled && plan !== "FREE" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCanceling}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </div>
        )}

        {isCanceled && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleResume}
              disabled={isResuming}
            >
              {isResuming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resuming...
                </>
              ) : (
                "Resume Subscription"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
