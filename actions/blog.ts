"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  published: z.boolean(),
});

export async function createBlogPost(data: z.infer<typeof blogPostSchema>) {
  try {
    const validated = blogPostSchema.parse(data);

    // Check if slug already exists
    const existing = await db.blog.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return { error: "A post with this slug already exists" };
    }

    await db.blog.create({
      data: validated,
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Error creating blog post:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to create post. Please try again." };
  }
}

export async function updateBlogPost(
  id: string,
  data: z.infer<typeof blogPostSchema>
) {
  try {
    const validated = blogPostSchema.parse(data);

    // Check if slug already exists (excluding current post)
    const existing = await db.blog.findFirst({
      where: {
        slug: validated.slug,
        id: { not: id },
      },
    });

    if (existing) {
      return { error: "A post with this slug already exists" };
    }

    await db.blog.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${validated.slug}`);
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Error updating blog post:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to update post. Please try again." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db.blog.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { error: "Failed to delete post. Please try again." };
  }
}
