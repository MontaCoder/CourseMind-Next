"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = updateProfileSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
    });

    // Check if email is already in use by another user
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: "Email is already in use" };
    }

    // Update user
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.name,
        email: validated.email,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update profile" };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = updatePasswordSchema.parse(rawData);

    // Check if new passwords match
    if (validated.newPassword !== validated.confirmPassword) {
      return { error: "New passwords do not match" };
    }

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return { error: "Cannot change password for OAuth accounts" };
    }

    // Verify current password
    const isCorrectPassword = await bcrypt.compare(
      validated.currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

    // Update password
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update password" };
  }
}

export async function deleteAccount() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete account" };
  }
}
