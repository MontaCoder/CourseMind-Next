import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseHeader } from "@/components/course/course-header";
import { ChapterList } from "@/components/course/chapter-list";
import { ProgressStats } from "@/components/course/progress-stats";
import { CourseNotes } from "@/components/course/course-notes";
import { AIChatbot } from "@/components/course/ai-chatbot";
import { CertificateCard } from "@/components/course/certificate-card";
import { PDFExportButton } from "@/components/course/pdf-export-button";

async function getCourse(courseId: string, userId: string) {
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          topics: {
            orderBy: { order: "asc" },
          },
        },
      },
      certificates: true,
    },
  });

  return course;
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { courseId } = await params;
  const course = await getCourse(courseId, session.user.id);

  if (!course) {
    notFound();
  }

  const existingCertificate = course.certificates?.[0] || null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pt-6">
      {/* Course Header */}
      <CourseHeader course={course} />

      {/* Progress Statistics & Achievements */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <ProgressStats chapters={course.chapters} />
      </div>

      {/* Certificate Section */}
      {course.progress >= 70 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Achievement</h2>
          <CertificateCard
            courseId={course.id}
            courseName={course.name}
            courseProgress={course.progress}
            existingCertificate={existingCertificate}
          />
        </div>
      )}

      {/* PDF Export Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Export Course</h2>
          <PDFExportButton
            course={course}
            userName={session.user.name || undefined}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Download your complete course content including all chapters, topics, and theory notes as a PDF document for offline study.
        </p>
      </div>

      {/* Chapter List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <ChapterList
          courseId={course.id}
          chapters={course.chapters}
          currentProgress={course.progress}
        />
      </div>

      {/* Course Notes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Notes</h2>
        <CourseNotes courseId={course.id} />
      </div>

      {/* AI Chatbot */}
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Course Tutor</h2>
        <AIChatbot courseId={course.id} courseName={course.name} />
      </div>
    </div>
  );
}
