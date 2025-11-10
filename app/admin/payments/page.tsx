import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import { PaymentTable } from "@/components/admin/payment-table";

async function getPaymentStats() {
  const subscriptions = await db.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const activeSubscriptions = subscriptions.filter((s) => s.status === "ACTIVE");
  const monthlyRevenue = activeSubscriptions.reduce((total, sub) => {
    if (sub.plan === "MONTHLY") return total + 9.99;
    if (sub.plan === "YEARLY") return total + 8.33; // Monthly equivalent
    return total;
  }, 0);

  const totalRevenue = subscriptions.reduce((total, sub) => {
    if (sub.status === "ACTIVE" || sub.status === "CANCELED") {
      if (sub.plan === "MONTHLY") return total + 9.99;
      if (sub.plan === "YEARLY") return total + 99.99;
    }
    return total;
  }, 0);

  return {
    subscriptions,
    activeSubscriptions: activeSubscriptions.length,
    monthlyRevenue,
    totalRevenue,
  };
}

export default async function AdminPaymentsPage() {
  const stats = await getPaymentStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Payment Monitoring
          </h2>
          <p className="text-muted-foreground">
            Track subscriptions and revenue
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current paying users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recurring monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Including canceled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active:</span>
                <span className="font-bold">
                  {
                    stats.subscriptions.filter(
                      (s) => s.plan === "MONTHLY" && s.status === "ACTIVE"
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-bold">
                  $
                  {(
                    stats.subscriptions.filter(
                      (s) => s.plan === "MONTHLY" && s.status === "ACTIVE"
                    ).length * 9.99
                  ).toFixed(2)}
                  /mo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active:</span>
                <span className="font-bold">
                  {
                    stats.subscriptions.filter(
                      (s) => s.plan === "YEARLY" && s.status === "ACTIVE"
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-bold">
                  $
                  {(
                    stats.subscriptions.filter(
                      (s) => s.plan === "YEARLY" && s.status === "ACTIVE"
                    ).length * 8.33
                  ).toFixed(2)}
                  /mo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Table */}
      <PaymentTable subscriptions={stats.subscriptions} />
    </div>
  );
}
