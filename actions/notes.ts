"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const noteSchema = z.object({
  courseId: z.string(),
  content: z.string().min(1, "Note content cannot be empty"),
});

export async function getNote(courseId: string) {
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

    // Get or create note
    const note = await db.note.findUnique({
      where: {
        courseId,
      },
    });

    return { note };
  } catch (error) {
    console.error("Error getting note:", error);
    return { error: "Failed to get note" };
  }
}

export async function saveNote(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = noteSchema.parse({
      courseId: formData.get("courseId"),
      content: formData.get("content"),
    });

    // Verify course ownership
    const course = await db.course.findFirst({
      where: {
        id: validated.courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Upsert note (create or update)
    const note = await db.note.upsert({
      where: {
        courseId: validated.courseId,
      },
      update: {
        content: validated.content,
      },
      create: {
        courseId: validated.courseId,
        userId: session.user.id,
        content: validated.content,
      },
    });

    return { success: true, note };
  } catch (error) {
    console.error("Error saving note:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to save note" };
  }
}

export async function deleteNote(courseId: string) {
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

    // Delete note if exists
    await db.note.deleteMany({
      where: {
        courseId,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { error: "Failed to delete note" };
  }
}
