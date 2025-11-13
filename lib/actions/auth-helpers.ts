import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Session } from "next-auth";

/**
 * Custom error class for action-specific errors
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/**
 * Require authentication - throws if user is not authenticated
 * @returns Authenticated session
 * @throws ActionError if user is not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    throw new ActionError("Unauthorized");
  }

  return session;
}

/**
 * Require admin role - throws if user is not an admin
 * @returns Authenticated admin session
 * @throws ActionError if user is not authenticated or not an admin
 */
export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new ActionError("Admin access required");
  }

  return session;
}

/**
 * Verify course ownership and return the course
 * @param courseId - The course ID to verify
 * @param userId - The user ID to check ownership against
 * @returns The course if user is the owner
 * @throws ActionError if course not found or user doesn't own it
 */
export async function requireCourseOwnership(courseId: string, userId: string) {
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    throw new ActionError("Course not found");
  }

  return course;
}

/**
 * Verify topic ownership through course relationship
 * @param topicId - The topic ID to verify
 * @param userId - The user ID to check ownership against
 * @returns The topic with chapter and course if user is the owner
 * @throws ActionError if topic not found or user doesn't own the course
 */
export async function requireTopicOwnership(topicId: string, userId: string) {
  const topic = await db.topic.findFirst({
    where: { id: topicId },
    include: {
      chapter: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!topic) {
    throw new ActionError("Topic not found");
  }

  if (topic.chapter.course.userId !== userId) {
    throw new ActionError("Unauthorized");
  }

  return topic;
}

/**
 * Verify exam ownership
 * @param examId - The exam ID to verify
 * @param userId - The user ID to check ownership against
 * @returns The exam if user is the owner
 * @throws ActionError if exam not found or user doesn't own it
 */
export async function requireExamOwnership(examId: string, userId: string) {
  const exam = await db.exam.findFirst({
    where: {
      id: examId,
      userId,
    },
  });

  if (!exam) {
    throw new ActionError("Quiz not found");
  }

  return exam;
}

/**
 * Verify note ownership
 * @param noteId - The note ID to verify
 * @param userId - The user ID to check ownership against
 * @returns The note if user is the owner
 * @throws ActionError if note not found or user doesn't own it
 */
export async function requireNoteOwnership(noteId: string, userId: string) {
  const note = await db.note.findFirst({
    where: {
      id: noteId,
      userId,
    },
  });

  if (!note) {
    throw new ActionError("Note not found");
  }

  return note;
}
