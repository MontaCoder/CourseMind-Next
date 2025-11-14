"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth-helpers";
import { withLegacyActionHandler } from "@/lib/actions/error-handler";
import { revalidatePath } from "next/cache";

/**
 * Delete a user and all associated data (admin only)
 * Cascade deletes: courses, chapters, topics, exams, notes, subscriptions
 */
export async function deleteUser(userId: string) {
  return withLegacyActionHandler(async () => {
    await requireAdmin();

    // Delete user and all associated data using cascade delete
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true };
  }, "Failed to delete user");
}

/**
 * Delete a course as admin (bypasses ownership check)
 * Cascade deletes: chapters, topics, exams
 */
export async function deleteCourseAsAdmin(courseId: string) {
  return withLegacyActionHandler(async () => {
    await requireAdmin();

    // Delete course and all associated data
    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  }, "Failed to delete course");
}

/**
 * Delete a blog post as admin (bypasses ownership check)
 */
export async function deleteBlogPostAsAdmin(postId: string) {
  return withLegacyActionHandler(async () => {
    await requireAdmin();

    await db.blog.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/blog");
    return { success: true };
  }, "Failed to delete blog post");
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  return withLegacyActionHandler(async () => {
    await requireAdmin();

    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  }, "Failed to update user role");
}

/**
 * Mark contact submission as resolved (admin only)
 */
export async function markContactResolved(contactId: string, resolved: boolean) {
  return withLegacyActionHandler(async () => {
    await requireAdmin();

    await db.contact.update({
      where: { id: contactId },
      data: { resolved },
    });

    revalidatePath("/admin/contact");
    return { success: true };
  }, "Failed to update contact status");
}
