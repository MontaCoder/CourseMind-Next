import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

async function getUserCourses(userId: string) {
  const courses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { chapters: true },
      },
    },
  });

  return courses;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const courses = await getUserCourses(session.user.id);

  const stats = {
    total: courses.length,
    completed: courses.filter((c) => c.progress === 100).length,
    inProgress: courses.filter((c) => c.progress > 0 && c.progress < 100)
      .length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {session.user.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your learning progress and create new courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your course library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Great progress!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/create">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
          {courses.length > 0 && (
            <Link href="/dashboard/courses">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          // Empty State
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No courses yet
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                Start your learning journey by creating your first AI-powered
                course. It only takes a few minutes!
              </p>
              <Link href="/dashboard/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // Courses Grid
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <Link href={`/dashboard/courses/${course.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {course.name}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {course.description || "No description available"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>
                            {course._count.chapters} chapter
                            {course._count.chapters !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {course.language && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs px-2 py-1 bg-muted rounded">
                              {course.language}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:bg-primary/10"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
