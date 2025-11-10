"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCourseShare(courseId: string) {
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

    // Check if share already exists
    const existingShare = await db.courseShare.findFirst({
      where: {
        courseId,
        userId: session.user.id,
      },
    });

    if (existingShare) {
      return { share: existingShare };
    }

    // Generate unique share token
    const shareToken = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Create share
    const share = await db.courseShare.create({
      data: {
        courseId,
        userId: session.user.id,
        shareToken,
        isPublic: true,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { share };
  } catch (error) {
    console.error("Error creating course share:", error);
    return { error: "Failed to create share link" };
  }
}

export async function deleteCourseShare(shareId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify share ownership
    const share = await db.courseShare.findFirst({
      where: {
        id: shareId,
        userId: session.user.id,
      },
    });

    if (!share) {
      return { error: "Share not found" };
    }

    await db.courseShare.delete({
      where: { id: shareId },
    });

    revalidatePath(`/dashboard/courses/${share.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting share:", error);
    return { error: "Failed to delete share link" };
  }
}

export async function getCourseShare(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const share = await db.courseShare.findFirst({
      where: {
        courseId,
        userId: session.user.id,
      },
    });

    return { share };
  } catch (error) {
    console.error("Error fetching share:", error);
    return { error: "Failed to fetch share link" };
  }
}

export async function getSharedCourse(shareToken: string) {
  try {
    const share = await db.courseShare.findUnique({
      where: { shareToken },
      include: {
        course: {
          include: {
            chapters: {
              orderBy: { order: "asc" },
            },
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!share || !share.isPublic) {
      return { error: "Share link not found or expired" };
    }

    // Check if expired
    if (share.expiresAt && share.expiresAt < new Date()) {
      return { error: "Share link has expired" };
    }

    // Increment view count
    await db.courseShare.update({
      where: { id: share.id },
      data: { viewCount: { increment: 1 } },
    });

    return { share };
  } catch (error) {
    console.error("Error fetching shared course:", error);
    return { error: "Failed to load shared course" };
  }
}
