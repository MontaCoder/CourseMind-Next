"use client";

import { useState } from "react";
import { Subscription } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import { STRIPE_PLANS } from "@/lib/stripe";
import { changePlan, createCheckoutSession } from "@/actions/stripe";
import { toast } from "sonner";

interface PlanSelectionSectionProps {
  subscription: Subscription | null;
}

export function PlanSelectionSection({ subscription }: PlanSelectionSectionProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = subscription?.plan || "FREE";
  const isCanceled = subscription?.cancelAtPeriodEnd;

  const handlePlanSelect = async (plan: "FREE" | "MONTHLY" | "YEARLY") => {
    if (plan === currentPlan) return;

    setLoadingPlan(plan);

    if (plan === "FREE") {
      toast.error("Cannot downgrade", {
        description: "Please cancel your subscription to return to the free plan.",
      });
      setLoadingPlan(null);
      return;
    }

    if (currentPlan === "FREE") {
      const result = await createCheckoutSession(plan);

      if (result.error) {
        toast.error("Failed to start checkout", {
          description: result.error,
        });
      } else if (result.url) {
        window.location.assign(result.url);
        return;
      }
    } else {
      const result = await changePlan(plan);

      if (result.error) {
        toast.error("Failed to change plan", {
          description: result.error,
        });
      } else {
        toast.success("Plan changed successfully", {
          description: "Your subscription has been updated.",
        });
        setTimeout(() => window.location.reload(), 1000);
        return;
      }
    }

    setLoadingPlan(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>
          {currentPlan === "FREE"
            ? "Choose a plan to unlock premium features"
            : "Upgrade or downgrade your subscription"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {(["FREE", "MONTHLY", "YEARLY"] as const).map((plan) => {
            const planDetails = STRIPE_PLANS[plan];
            const isCurrent = plan === currentPlan;
            const isLoading = loadingPlan === plan;
            const featured = plan === "YEARLY";

            return (
              <div
                key={plan}
                className={`relative rounded-lg border p-6 ${
                  featured
                    ? "border-primary shadow-lg"
                    : "border-border"
                } ${isCurrent ? "bg-muted/50" : "bg-card"}`}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Best Value
                    </Badge>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="secondary">Current Plan</Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{planDetails.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        ${planDetails.price}
                      </span>
                      {plan !== "FREE" && (
                        <span className="text-muted-foreground text-sm">
                          /{plan === "MONTHLY" ? "mo" : "yr"}
                        </span>
                      )}
                    </div>
                    {plan === "YEARLY" && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Save $20 per year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={
                      isCurrent ||
                      isLoading ||
                      loadingPlan !== null ||
                      (isCanceled && plan !== "FREE")
                    }
                    variant={featured && !isCurrent ? "default" : "outline"}
                    className={`w-full ${
                      featured && !isCurrent
                        ? "bg-gradient-to-r from-primary to-accent"
                        : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : currentPlan === "FREE" && plan !== "FREE" ? (
                      "Subscribe"
                    ) : plan === "FREE" ? (
                      "Downgrade"
                    ) : (
                      "Switch Plan"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
