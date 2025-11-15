import Link from "next/link";
import { APP_CONFIG, STRIPE_PLANS } from "@/lib/config/constants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { StatCard } from "@/components/admin/shared/stat-card";
import { Globe, Mail, CreditCard } from "lucide-react";

const stripeEnvKeys = [
  { key: "STRIPE_SECRET_KEY", label: "Stripe secret key" },
  { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe webhook secret" },
  { key: "STRIPE_MONTHLY_PRICE_ID", label: "Stripe monthly price ID" },
  { key: "STRIPE_YEARLY_PRICE_ID", label: "Stripe yearly price ID" },
] as const;

export default function AdminSettingsPage() {
  const planEntries = Object.entries(STRIPE_PLANS) as [keyof typeof STRIPE_PLANS, (typeof STRIPE_PLANS)[keyof typeof STRIPE_PLANS]][];

  return (
    <div className="max-w-6xl space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin settings</h1>
        <p className="text-muted-foreground">
          Review app defaults, pricing, and Stripe connectivity without touching the database.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="App URL"
          value={APP_CONFIG.url}
          description="Documented base domain"
          icon={Globe}
        />
        <StatCard
          title="Support email"
          value={APP_CONFIG.supportEmail}
          description="Customer + billing inbox"
          icon={Mail}
        />
        <StatCard
          title="Configured plans"
          value={planEntries.length}
          description="Free, monthly, yearly"
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Application info</CardTitle>
            <CardDescription>Branding and support details come from config.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                App name
              </p>
              <p className="font-medium text-lg">{APP_CONFIG.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Base URL
              </p>
              <p className="font-medium">{APP_CONFIG.url}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Support contact
              </p>
              <p className="font-medium">{APP_CONFIG.supportEmail}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe status</CardTitle>
            <CardDescription>Verify env vars without exposing secrets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stripeEnvKeys.map((entry) => {
                const isConfigured = Boolean(process.env[entry.key]);
                return (
                  <div
                    key={entry.key}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{entry.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {isConfigured ? "Configured" : "Missing"}
                      </p>
                    </div>
                    <StatusBadge status={isConfigured ? "Active" : "Missing"} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Subscription plans</h2>
            <p className="text-sm text-muted-foreground">
              Source of truth: `STRIPE_PLANS`.
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {planEntries.map(([planId, plan]) => {
            const priceLabel =
              planId === "FREE"
                ? "Free forever"
                : `$${plan.price}/${planId === "MONTHLY" ? "mo" : "yr"}`;
            const courseTypeLabel =
              plan.courseType === "VIDEO_TEXT" ? "Video + Text" : "Text + Image";

            return (
              <Card key={planId} className="h-full">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{priceLabel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    📈 {plan.limits.courses} courses · {courseTypeLabel}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="leading-tight">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <StatusBadge status="Active" />
                  <p className="text-xs text-muted-foreground">
                    Synced from config
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
          <CardDescription>Jump to related admin surfaces.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/admin/payments" className="w-full">
              <Button className="w-full">Payment monitoring</Button>
            </Link>
            <Link href="/admin/policies" className="w-full">
              <Button variant="outline" className="w-full">
                Manage policies
              </Button>
            </Link>
            <Link href="/pricing" className="w-full">
              <Button variant="ghost" className="w-full">
                Public pricing
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

