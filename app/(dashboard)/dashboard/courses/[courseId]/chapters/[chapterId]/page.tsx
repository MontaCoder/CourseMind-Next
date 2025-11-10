import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChapterQuiz } from "@/components/course/chapter-quiz";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

async function getChapter(
  courseId: string,
  chapterId: string,
  userId: string
) {
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        where: { id: chapterId },
        include: {
          topics: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course || course.chapters.length === 0) {
    return null;
  }

  return {
    course,
    chapter: course.chapters[0],
  };
}

interface PageProps {
  params: Promise<{ courseId: string; chapterId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChapterPage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { courseId, chapterId } = await params;
  const data = await getChapter(courseId, chapterId, session.user.id);

  if (!data) {
    notFound();
  }

  const { course, chapter } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={`/dashboard/courses/${course.id}`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </Link>

      {/* Chapter Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-muted-foreground">{chapter.description}</p>
      </div>

      {/* Chapter Topics - Now clickable! */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Topics in This Chapter
          </CardTitle>
          <CardDescription>
            Click on any topic to start learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chapter.topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/dashboard/courses/${course.id}/chapters/${chapter.id}/topics/${topic.id}`}
                className="block"
              >
                <div className="group p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="text-sm text-muted-foreground">
                          {topic.description}
                        </p>
                      )}
                      {topic.completed && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-2">
                          <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                            ✓
                          </span>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chapter Quiz */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Chapter Quiz</h2>
        <ChapterQuiz
          courseId={course.id}
          chapterId={chapter.id}
          chapterTitle={chapter.title}
        />
      </div>
    </div>
  );
}
