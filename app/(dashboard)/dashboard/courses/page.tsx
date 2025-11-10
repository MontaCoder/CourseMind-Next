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
  ArrowRight,
  Trash2,
  Clock,
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

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const courses = await getUserCourses(session.user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-2">
            {courses.length} {courses.length === 1 ? "course" : "courses"} in
            your library
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        // Empty State
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Start your learning journey by creating your first AI-powered
              course.
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
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow group flex flex-col"
            >
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="flex-1 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {course.name}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {course.description || "No description available"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
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

                    {/* Created Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary/10"
                  >
                    {course.progress === 0
                      ? "Start Learning"
                      : course.progress === 100
                        ? "Review Course"
                        : "Continue Learning"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
