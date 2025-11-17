"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { generateCourseOutline, generateQuizQuestions } from "@/lib/gemini";
import { SUPPORTED_LANGUAGES, getCourseLimit, getCourseType } from "@/lib/config/constants";
import { requireAuth, requireCourseOwnership } from "@/lib/actions/auth-helpers";
import { withLegacyActionHandler } from "@/lib/actions/error-handler";
import { getUserSubscriptionStatus, getUserPlan } from "@/lib/queries/subscription-queries";

const createCourseSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  language: z.enum(SUPPORTED_LANGUAGES as unknown as [string, ...string[]]),
  chapterCount: z.number().min(3).max(10),
  courseType: z.enum(["TEXT_IMAGE", "VIDEO_TEXT"] as const),
});

export async function createCourse(formData: FormData) {
  return withLegacyActionHandler(async () => {
    const session = await requireAuth();

    const validated = createCourseSchema.parse({
      topic: formData.get("topic"),
      language: formData.get("language"),
      chapterCount: parseInt(formData.get("chapterCount") as string),
      courseType: formData.get("courseType"),
    });

    // Get user's subscription and course count
    const user = await getUserSubscriptionStatus(session.user.id);

    if (!user) {
      return { error: "User not found" };
    }

    // Check subscription limits
    const subscriptionPlan = await getUserPlan(session.user.id);
    const courseCount = user._count.courses;
    const courseLimit = getCourseLimit(subscriptionPlan);

    if (session.user.role !== "ADMIN" && courseCount >= courseLimit) {
      return {
        error: `You have reached your course limit. Please upgrade your plan to create more courses.`,
      };
    }

    // Generate course outline using Gemini
    const courseOutline = await generateCourseOutline(
      validated.topic,
      validated.language,
      validated.chapterCount
    );

    // Create course in database with chapters and topics (lazy-load content)
    const course = await db.course.create({
      data: {
        userId: session.user.id,
        name: courseOutline.name,
        description: courseOutline.description,
        language: validated.language,
        courseType: validated.courseType,
        progress: 0,
        chapters: {
          create: courseOutline.chapters.map((chapter, chapterIndex) => ({
            title: chapter.title,
            description: chapter.description,
            order: chapterIndex,
            topics: {
              create: chapter.topics.map((topic, topicIndex) => ({
                title: topic.title,
                description: topic.description,
                theory: null, // Lazy-load when user views topic
                videoId: null, // Lazy-load when user views topic
                imageUrl: null, // Lazy-load when user views topic
                completed: false,
                order: topicIndex,
              })),
            },
          })),
        },
      },
      include: {
        chapters: {
          include: {
            topics: true,
          },
        },
      },
    });

    return { success: true, courseId: course.id };
  }, "Failed to create course. Please try again.");
}

export async function updateCourseProgress(courseId: string, progress: number) {
  return withLegacyActionHandler(async () => {
    const session = await requireAuth();
    await requireCourseOwnership(courseId, session.user.id);

    // Update progress
    await db.course.update({
      where: { id: courseId },
      data: { progress },
    });

    return { success: true };
  }, "Failed to update progress");
}

export async function deleteCourse(courseId: string) {
  return withLegacyActionHandler(async () => {
    const session = await requireAuth();
    await requireCourseOwnership(courseId, session.user.id);

    // Delete course (cascade will handle chapters, notes, exams)
    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  }, "Failed to delete course");
}

export async function generateChapterQuiz(
  courseId: string,
  chapterId: string
) {
  return withLegacyActionHandler(async () => {
    const session = await requireAuth();

    // Verify course ownership
    await requireCourseOwnership(courseId, session.user.id);

    // Get chapter with topics and course
    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        topics: true,
        course: true,
      },
    });

    if (!chapter) {
      return { error: "Chapter not found" };
    }

    const course = chapter.course;

    // Check if quiz already exists
    const existingQuiz = await db.exam.findFirst({
      where: {
        courseId,
        chapterId,
      },
    });

    if (existingQuiz) {
      return { error: "Quiz already exists for this chapter" };
    }

    // Convert topics to string array for quiz generation
    const topicTitles = chapter.topics.map((topic) => topic.title);

    // Generate quiz questions using Gemini
    const questions = await generateQuizQuestions(
      course.name,
      chapter.title,
      topicTitles,
      5,
      course.language
    );

    // Create exam in database
    const exam = await db.exam.create({
      data: {
        courseId,
        chapterId,
        userId: session.user.id,
        questions: questions as any, // Prisma Json type
        score: null,
      },
    });

    return { success: true, examId: exam.id, questions };
  }, "Failed to generate quiz. Please try again.");
}

export async function submitQuizAnswers(
  examId: string,
  answers: number[]
) {
  return withLegacyActionHandler(async () => {
    const session = await requireAuth();

    // Get exam with verification
    const exam = await db.exam.findFirst({
      where: {
        id: examId,
        userId: session.user.id,
      },
    });

    if (!exam) {
      return { error: "Quiz not found" };
    }

    // Calculate score
    const questions = exam.questions as any[];
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Update exam with score
    await db.exam.update({
      where: { id: examId },
      data: {
        score,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      score,
      correctCount,
      totalQuestions: questions.length,
    };
  }, "Failed to submit answers");
}
