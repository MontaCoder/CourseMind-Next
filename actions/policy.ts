"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const policySchema = z.object({
  type: z.string().min(1, "Policy type is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export async function updatePolicy(data: z.infer<typeof policySchema>) {
  try {
    // Check authentication and admin role
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized. Please sign in." };
    }

    if (session.user.role !== "ADMIN") {
      return { error: "Forbidden. Admin access required." };
    }

    const validated = policySchema.parse(data);

    // Check if policy exists
    const existingPolicy = await db.policy.findUnique({
      where: { type: validated.type },
    });

    if (existingPolicy) {
      // Update existing policy
      await db.policy.update({
        where: { type: validated.type },
        data: {
          title: validated.title,
          content: validated.content,
        },
      });
    } else {
      // Create new policy
      await db.policy.create({
        data: {
          type: validated.type,
          title: validated.title,
          content: validated.content,
        },
      });
    }

    // Revalidate public pages
    revalidatePath(`/${validated.type}`);
    revalidatePath("/admin/policies");

    return { success: true };
  } catch (error) {
    console.error("Error updating policy:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to update policy. Please try again." };
  }
}

export async function getPolicy(type: string) {
  try {
    const policy = await db.policy.findUnique({
      where: { type },
    });

    return { policy };
  } catch (error) {
    console.error("Error fetching policy:", error);
    return { error: "Failed to fetch policy" };
  }
}

export async function deletePolicy(type: string) {
  try {
    // Check authentication and admin role
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized. Please sign in." };
    }

    if (session.user.role !== "ADMIN") {
      return { error: "Forbidden. Admin access required." };
    }

    await db.policy.delete({
      where: { type },
    });

    revalidatePath("/admin/policies");
    revalidatePath(`/${type}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting policy:", error);
    return { error: "Failed to delete policy. Please try again." };
  }
}
