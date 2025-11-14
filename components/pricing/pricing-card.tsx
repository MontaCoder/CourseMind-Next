"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import { STRIPE_PLANS, type StripePlan } from "@/lib/constants";
import { createCheckoutSession } from "@/actions/stripe";

interface PricingCardProps {
  plan: StripePlan;
  featured?: boolean;
}

export function PricingCard({ plan, featured = false }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const planDetails = STRIPE_PLANS[plan];

  const handleSubscribe = async () => {
    if (plan === "FREE") {
      router.push("/signup");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCheckoutSession(plan);

      if (result.error) {
        alert(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      alert("Failed to start checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`relative ${
        featured
          ? "border-primary shadow-lg scale-105"
          : "border-border"
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{planDetails.name}</CardTitle>
        <CardDescription>
          <span className="mt-4 block">
            <span className="text-4xl font-bold text-foreground">
              ${planDetails.price}
            </span>
            {plan !== "FREE" && (
              <span className="text-muted-foreground">
                /{plan === "MONTHLY" ? "month" : "year"}
              </span>
            )}
          </span>
          {plan === "YEARLY" && (
            <span className="text-sm text-green-600 dark:text-green-400 mt-1 block">
              Save $20 per year
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {planDetails.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full ${
            featured
              ? "bg-gradient-to-r from-primary to-accent"
              : ""
          }`}
          variant={featured ? "default" : "outline"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : plan === "FREE" ? (
            "Get Started"
          ) : (
            "Subscribe Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
