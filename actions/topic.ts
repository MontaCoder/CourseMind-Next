"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateTopicContentForContext } from "@/lib/ai/topic-content";

/**
 * Generate content for a topic (theory + video/image)
 * This implements lazy-loading like v2
 */
export async function generateTopicContent(topicId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get topic with chapter and course info
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
      return { error: "Topic not found" };
    }

    // Verify course ownership
    if (topic.chapter.course.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    // If content already exists, return it
    if (topic.theory && (topic.videoId || topic.imageUrl)) {
      return {
        success: true,
        topic: {
          id: topic.id,
          title: topic.title,
          theory: topic.theory,
          videoId: topic.videoId,
          imageUrl: topic.imageUrl,
          completed: topic.completed,
        },
      };
    }

    const course = topic.chapter.course;

    const { theoryHtml, videoId, imageUrl } = await generateTopicContentForContext({
      title: topic.title,
      description: topic.description,
      chapterTitle: topic.chapter.title,
      language: course.language,
      courseType: course.courseType,
    });

    // Update topic in database
    const updatedTopic = await db.topic.update({
      where: { id: topicId },
      data: {
        theory: theoryHtml,
        videoId,
        imageUrl,
      },
    });

    return {
      success: true,
      topic: {
        id: updatedTopic.id,
        title: updatedTopic.title,
        theory: updatedTopic.theory,
        videoId: updatedTopic.videoId,
        imageUrl: updatedTopic.imageUrl,
        completed: updatedTopic.completed,
      },
    };
  } catch (error) {
    console.error("Error generating topic content:", error);
    return { error: "Failed to generate content. Please try again." };
  }
}

/**
 * Mark a topic as completed or uncompleted
 */
export async function toggleTopicCompletion(topicId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get topic with course info
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
      return { error: "Topic not found" };
    }

    // Verify course ownership
    if (topic.chapter.course.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    // Toggle completion
    const updatedTopic = await db.topic.update({
      where: { id: topicId },
      data: {
        completed: !topic.completed,
      },
    });

    // Update course progress
    await updateCourseProgress(topic.chapter.course.id);

    return {
      success: true,
      completed: updatedTopic.completed,
    };
  } catch (error) {
    console.error("Error toggling topic completion:", error);
    return { error: "Failed to update completion status" };
  }
}

/**
 * Regenerate content for a topic (allow users to refresh if not satisfied)
 */
export async function regenerateTopicContent(topicId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get topic
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
      return { error: "Topic not found" };
    }

    // Verify course ownership
    if (topic.chapter.course.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    // Clear existing content
    await db.topic.update({
      where: { id: topicId },
      data: {
        theory: null,
        videoId: null,
        imageUrl: null,
      },
    });

    // Generate fresh content
    return generateTopicContent(topicId);
  } catch (error) {
    console.error("Error regenerating topic content:", error);
    return { error: "Failed to regenerate content" };
  }
}

/**
 * Get topic with its content
 */
export async function getTopic(topicId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

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
      return { error: "Topic not found" };
    }

    // Verify course ownership
    if (topic.chapter.course.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    return {
      success: true,
      topic: {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        theory: topic.theory,
        videoId: topic.videoId,
        imageUrl: topic.imageUrl,
        completed: topic.completed,
        order: topic.order,
        chapterId: topic.chapterId,
        chapterTitle: topic.chapter.title,
        courseId: topic.chapter.courseId,
        courseType: topic.chapter.course.courseType,
      },
    };
  } catch (error) {
    console.error("Error getting topic:", error);
    return { error: "Failed to get topic" };
  }
}

/**
 * Update course progress based on completed topics
 */
async function updateCourseProgress(courseId: string) {
  try {
    // Get all topics for the course
    const chapters = await db.chapter.findMany({
      where: { courseId },
      include: {
        topics: true,
      },
    });

    let totalTopics = 0;
    let completedTopics = 0;

    chapters.forEach((chapter) => {
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter((t) => t.completed).length;
    });

    // Calculate progress percentage
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Update course
    await db.course.update({
      where: { id: courseId },
      data: { progress },
    });

    return progress;
  } catch (error) {
    console.error("Error updating course progress:", error);
    return 0;
  }
}
