"use client";

import { Subscription } from "@prisma/client";
import Stripe from "stripe";
import { CurrentPlanSection } from "./current-plan-section";
import { PlanSelectionSection } from "./plan-selection-section";
import { PaymentMethodsSection } from "./payment-methods-section";
import { InvoiceHistorySection } from "./invoice-history-section";

interface BillingDashboardProps {
  subscription: Subscription | null;
  paymentMethods: Stripe.PaymentMethod[];
  invoices: Stripe.Invoice[];
  defaultPaymentMethod: string | null;
}

export function BillingDashboard({
  subscription,
  paymentMethods,
  invoices,
  defaultPaymentMethod,
}: BillingDashboardProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, payment methods, and invoices
        </p>
      </div>

      <CurrentPlanSection subscription={subscription} />

      <PlanSelectionSection subscription={subscription} />

      <PaymentMethodsSection
        paymentMethods={paymentMethods}
        defaultPaymentMethod={defaultPaymentMethod}
      />

      <InvoiceHistorySection invoices={invoices} />
    </div>
  );
}
