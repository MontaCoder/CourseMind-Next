import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TopicContent } from "@/components/course/topic-content";
import { TopicNavigation } from "@/components/course/topic-navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getTopicData(topicId: string, userId: string) {
  const topic = await db.topic.findFirst({
    where: { id: topicId },
    include: {
      chapter: {
        include: {
          course: true,
          topics: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  // Verify ownership
  if (!topic || !topic.chapter.course || topic.chapter.course.userId !== userId) {
    return null;
  }

  return {
    topic,
    chapter: topic.chapter,
    course: topic.chapter.course,
    allTopics: topic.chapter.topics,
  };
}

interface PageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
    topicId: string;
  }>;
}

export default async function TopicPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { courseId, chapterId, topicId } = await params;
  const data = await getTopicData(topicId, session.user.id);

  if (!data) {
    notFound();
  }

  const { topic, chapter, course, allTopics } = data;

  // Find current topic index for navigation
  const currentIndex = allTopics.findIndex((t) => t.id === topicId);
  const previousTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href={`/dashboard/courses/${courseId}/chapters/${chapterId}`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chapter
        </Button>
      </Link>

      {/* Topic Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{course.name}</span>
          <span>→</span>
          <span>{chapter.title}</span>
          <span>→</span>
          <span className="text-foreground font-medium">
            Topic {topic.order + 1}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
        {topic.description && (
          <p className="text-lg text-muted-foreground">{topic.description}</p>
        )}
      </div>

      {/* Topic Content Component (handles lazy loading) */}
      <TopicContent
        topicId={topic.id}
        courseId={course.id}
        courseType={course.courseType}
        initialTopic={topic}
      />

      {/* Navigation */}
      <TopicNavigation
        courseId={courseId}
        chapterId={chapterId}
        previousTopic={previousTopic}
        nextTopic={nextTopic}
        currentTopicId={topicId}
      />
    </div>
  );
}
