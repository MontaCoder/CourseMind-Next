"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateCourseOutline, generateQuizQuestions } from "@/lib/gemini";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

const createCourseSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  language: z.enum(SUPPORTED_LANGUAGES as unknown as [string, ...string[]]),
  chapterCount: z.number().min(3).max(10),
});

export async function createCourse(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = createCourseSchema.parse({
      topic: formData.get("topic"),
      language: formData.get("language"),
      chapterCount: parseInt(formData.get("chapterCount") as string),
    });

    // Get user's subscription and course count
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check subscription limits
    const subscriptionPlan = (user.subscriptions[0]?.plan || "FREE") as "FREE" | "MONTHLY" | "YEARLY";
    const courseCount = user._count.courses;

    const limits: Record<"FREE" | "MONTHLY" | "YEARLY", number> = {
      FREE: 3,
      MONTHLY: 50,
      YEARLY: 50,
    };

    if (courseCount >= limits[subscriptionPlan]) {
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

    // Determine course type based on subscription
    const courseType = subscriptionPlan === "FREE" ? "TEXT_IMAGE" : "VIDEO_TEXT";

    // Create course in database with chapters and topics (lazy-load content)
    const course = await db.course.create({
      data: {
        userId: session.user.id,
        name: courseOutline.name,
        description: courseOutline.description,
        language: validated.language,
        courseType,
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
  } catch (error) {
    console.error("Error creating course:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to create course. Please try again." };
  }
}

export async function updateCourseProgress(courseId: string, progress: number) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify course ownership
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Update progress
    await db.course.update({
      where: { id: courseId },
      data: { progress },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating course progress:", error);
    return { error: "Failed to update progress" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify course ownership
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Delete course (cascade will handle chapters, notes, exams)
    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Failed to delete course" };
  }
}

export async function generateChapterQuiz(
  courseId: string,
  chapterId: string
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get course and chapter with verification
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      include: {
        chapters: {
          where: { id: chapterId },
          include: {
            topics: true, // Include topics relation
          },
        },
      },
    });

    if (!course || course.chapters.length === 0) {
      return { error: "Course or chapter not found" };
    }

    const chapter = course.chapters[0];

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
  } catch (error) {
    console.error("Error generating chapter quiz:", error);
    return { error: "Failed to generate quiz. Please try again." };
  }
}

export async function submitQuizAnswers(
  examId: string,
  answers: number[]
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

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
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    return { error: "Failed to submit answers" };
  }
}
