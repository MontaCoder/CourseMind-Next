import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBillingData } from "@/actions/stripe";
import { BillingDashboard } from "@/components/billing/billing-dashboard";

export const metadata = {
  title: "Billing - CourseMind",
  description: "Manage your subscription and billing information",
};

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const billingData = await getBillingData();

  if ("error" in billingData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {billingData.error}
        </div>
      </div>
    );
  }

  return (
    <BillingDashboard
      subscription={billingData.subscription}
      paymentMethods={billingData.paymentMethods}
      invoices={billingData.invoices}
      defaultPaymentMethod={billingData.defaultPaymentMethod}
    />
  );
}
