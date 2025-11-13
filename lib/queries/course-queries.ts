import { db } from "@/lib/db";

/**
 * Get a course with all its chapters and topics
 */
export async function getCourseWithContent(courseId: string, userId: string) {
  return db.course.findFirst({
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
    },
  });
}

/**
 * Get all courses for a user with basic info
 */
export async function getUserCourses(userId: string) {
  return db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      chapters: {
        include: {
          topics: {
            select: {
              id: true,
              completed: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get course with specific chapter
 */
export async function getCourseWithChapter(
  courseId: string,
  chapterId: string,
  userId: string
) {
  return db.course.findFirst({
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
}

/**
 * Get user's course count
 */
export async function getUserCourseCount(userId: string): Promise<number> {
  return db.course.count({
    where: { userId },
  });
}

/**
 * Calculate course progress based on completed topics
 */
export async function calculateCourseProgress(courseId: string): Promise<number> {
  const chapters = await db.chapter.findMany({
    where: { courseId },
    include: {
      topics: {
        select: {
          completed: true,
        },
      },
    },
  });

  let totalTopics = 0;
  let completedTopics = 0;

  chapters.forEach((chapter) => {
    totalTopics += chapter.topics.length;
    completedTopics += chapter.topics.filter((t) => t.completed).length;
  });

  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
}

/**
 * Update course progress
 */
export async function updateCourseProgress(courseId: string) {
  const progress = await calculateCourseProgress(courseId);

  await db.course.update({
    where: { id: courseId },
    data: { progress },
  });

  return progress;
}
