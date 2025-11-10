import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, UserCheck } from "lucide-react";

async function getStats() {
  const [
    totalUsers,
    activeSubscriptions,
    totalCourses,
    recentUsers,
    recentCourses,
    recentSubscriptions,
  ] = await Promise.all([
    db.user.count(),
    db.subscription.count({
      where: { status: "ACTIVE" },
    }),
    db.course.count(),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    db.course.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    db.subscription.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  // Calculate monthly revenue
  const monthlyRevenue = recentSubscriptions.reduce((total, sub) => {
    if (sub.plan === "MONTHLY") return total + 9.99;
    if (sub.plan === "YEARLY") return total + 99.99;
    return total;
  }, 0);

  return {
    totalUsers,
    activeSubscriptions,
    totalCourses,
    monthlyRevenue,
    recentUsers,
    recentCourses,
    recentSubscriptions,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening with CourseMind.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pro plan users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Courses created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recent subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users yet</p>
              ) : (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentSubscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subscriptions yet
                </p>
              ) : (
                stats.recentSubscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sub.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sub.plan === "MONTHLY" ? "$9.99/mo" : "$99.99/yr"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses yet</p>
            ) : (
              stats.recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">
                      by {course.user.name} • {course.language}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
