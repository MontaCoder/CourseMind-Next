"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  cancelSubscription,
  createPortalSession,
} from "@/actions/stripe";

interface BillingActionsProps {
  hasActiveSubscription: boolean;
  cancelAtPeriodEnd?: boolean;
}

export function BillingActions({
  hasActiveSubscription,
  cancelAtPeriodEnd = false,
}: BillingActionsProps) {
  const router = useRouter();
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleManageBilling = async () => {
    setErrorMessage(null);
    setIsPortalLoading(true);

    try {
      const result = await createPortalSession();

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Manage billing failed", error);
      setErrorMessage("Failed to open the billing portal.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setErrorMessage(null);
    setIsCancelLoading(true);

    try {
      const result = await cancelSubscription();
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Cancel subscription failed", error);
      setErrorMessage("Failed to cancel subscription.");
    } finally {
      setIsCancelLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleManageBilling}
        disabled={!hasActiveSubscription || isPortalLoading}
        className="w-full"
      >
        {isPortalLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening billing portal...
          </>
        ) : (
          "Manage billing"
        )}
      </Button>

      {hasActiveSubscription && !cancelAtPeriodEnd && (
        <Button
          variant="outline"
          onClick={handleCancelSubscription}
          disabled={isCancelLoading}
          className="w-full"
        >
          {isCancelLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling cancelation...
            </>
          ) : (
            "Cancel at period end"
          )}
        </Button>
      )}

      {!hasActiveSubscription && (
        <p className="text-sm text-muted-foreground">
          Subscribe to a paid plan to unlock billing management.
        </p>
      )}

      {cancelAtPeriodEnd && hasActiveSubscription && (
        <p className="text-sm text-muted-foreground">
          Your subscription will cancel at the end of the current billing period.
        </p>
      )}

      {errorMessage && (
        <p className="text-sm text-destructive text-center">{errorMessage}</p>
      )}
    </div>
  );
}

