"use client";

import { useState } from "react";
import Stripe from "stripe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { removePaymentMethod, setDefaultPaymentMethod } from "@/actions/stripe";
import { toast } from "sonner";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";

interface PaymentMethodsSectionProps {
  paymentMethods: Stripe.PaymentMethod[];
  defaultPaymentMethod: string | null;
}

export function PaymentMethodsSection({
  paymentMethods,
  defaultPaymentMethod,
}: PaymentMethodsSectionProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleRemove = async (paymentMethodId: string) => {
    setLoadingAction(`remove-${paymentMethodId}`);
    const result = await removePaymentMethod(paymentMethodId);

    if (result.error) {
      toast.error("Failed to remove", {
        description: result.error,
      });
    } else {
      toast.success("Payment method removed");
      setTimeout(() => window.location.reload(), 500);
    }

    setLoadingAction(null);
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setLoadingAction(`default-${paymentMethodId}`);
    const result = await setDefaultPaymentMethod(paymentMethodId);

    if (result.error) {
      toast.error("Failed to set default", {
        description: result.error,
      });
    } else {
      toast.success("Default payment method updated");
      setTimeout(() => window.location.reload(), 500);
    }

    setLoadingAction(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No payment methods added yet</p>
            <p className="text-xs mt-1">
              Add a payment method to manage your subscription
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const isDefault = method.id === defaultPaymentMethod;
              const isRemoving = loadingAction === `remove-${method.id}`;
              const isSettingDefault = loadingAction === `default-${method.id}`;

              return (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          •••• •••• •••• {method.card?.last4 || "****"}
                        </p>
                        {isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.card?.brand ? 
                          method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1) 
                          : "Card"}{" "}
                        • Expires {method.card?.exp_month}/{method.card?.exp_year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={isSettingDefault || isRemoving}
                      >
                        {isSettingDefault ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          "Set Default"
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(method.id)}
                      disabled={isRemoving || isSettingDefault}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <AddPaymentMethodDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </Card>
  );
}
