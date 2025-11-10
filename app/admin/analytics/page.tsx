import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
} from "lucide-react";

async function getAnalytics() {
  // Get time ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch all data in parallel
  const [
    totalUsers,
    usersLast30Days,
    usersLast7Days,
    totalCourses,
    coursesLast30Days,
    coursesLast7Days,
    totalSubscriptions,
    activeSubscriptions,
    subscriptionsLast30Days,
    totalBlogPosts,
    publishedBlogPosts,
    totalContacts,
    unresolvedContacts,
  ] = await Promise.all([
    // Users
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),

    // Courses
    db.course.count(),
    db.course.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.course.count({ where: { createdAt: { gte: sevenDaysAgo } } }),

    // Subscriptions
    db.subscription.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.subscription.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

    // Blog
    db.blog.count(),
    db.blog.count({ where: { published: true } }),

    // Contacts
    db.contact.count(),
    db.contact.count({ where: { resolved: false } }),
  ]);

  // Calculate revenue
  const monthlyRevenue = activeSubscriptions * 9.99; // Simplified calculation

  // Calculate growth rates
  const userGrowth = usersLast7Days > 0 ? ((usersLast7Days / (totalUsers - usersLast7Days)) * 100).toFixed(1) : "0";
  const courseGrowth = coursesLast7Days > 0 ? ((coursesLast7Days / (totalCourses - coursesLast7Days)) * 100).toFixed(1) : "0";

  return {
    users: {
      total: totalUsers,
      last30Days: usersLast30Days,
      last7Days: usersLast7Days,
      growth: userGrowth,
    },
    courses: {
      total: totalCourses,
      last30Days: coursesLast30Days,
      last7Days: coursesLast7Days,
      growth: courseGrowth,
    },
    subscriptions: {
      total: totalSubscriptions,
      active: activeSubscriptions,
      last30Days: subscriptionsLast30Days,
    },
    revenue: {
      monthly: monthlyRevenue,
      conversionRate: totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : "0",
    },
    blog: {
      total: totalBlogPosts,
      published: publishedBlogPosts,
    },
    contacts: {
      total: totalContacts,
      unresolved: unresolvedContacts,
    },
  };
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Comprehensive platform metrics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.users.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.users.last7Days} this week ({analytics.users.growth}% growth)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.courses.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.courses.last7Days} this week ({analytics.courses.growth}% growth)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.subscriptions.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.revenue.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.revenue.monthly.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From active subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last 7 days</span>
                </div>
                <span className="font-bold">{analytics.users.last7Days} users</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last 30 days</span>
                </div>
                <span className="font-bold">{analytics.users.last30Days} users</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Total Users</span>
                <span className="font-bold text-lg">{analytics.users.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last 7 days</span>
                </div>
                <span className="font-bold">{analytics.courses.last7Days} courses</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last 30 days</span>
                </div>
                <span className="font-bold">{analytics.courses.last30Days} courses</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Total Courses</span>
                <span className="font-bold text-lg">{analytics.courses.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="font-bold text-green-600">{analytics.subscriptions.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold">{analytics.subscriptions.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New (30 days)</span>
                <span className="font-bold">{analytics.subscriptions.last30Days}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="font-bold text-lg">{analytics.revenue.conversionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blog Posts (Published)</span>
                <span className="font-bold">{analytics.blog.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blog Posts (Total)</span>
                <span className="font-bold">{analytics.blog.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contact Submissions</span>
                <span className="font-bold">{analytics.contacts.total}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Pending Contacts</span>
                <span className="font-bold text-lg text-orange-600">
                  {analytics.contacts.unresolved}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
