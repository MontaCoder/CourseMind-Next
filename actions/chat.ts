"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatWithAI, type ChatMessage } from "@/lib/gemini";

const chatSchema = z.object({
  courseId: z.string(),
  message: z.string().min(1, "Message cannot be empty"),
  chatHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function sendChatMessage(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = chatSchema.parse({
      courseId: formData.get("courseId"),
      message: formData.get("message"),
      chatHistory: JSON.parse(formData.get("chatHistory") as string),
    });

    // Verify course ownership and get course details
    const course = await db.course.findFirst({
      where: {
        id: validated.courseId,
        userId: session.user.id,
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

    if (!course) {
      return { error: "Course not found" };
    }

    // Add new user message to history
    const messages: ChatMessage[] = [
      ...validated.chatHistory,
      {
        role: "user",
        content: validated.message,
      },
    ];

    // Build course context with topic titles
    const courseContext = {
      courseName: course.name,
      topics: course.chapters.flatMap((ch) => ch.topics.map((t) => t.title)),
    };

    // Get AI response
    const aiResponse = await chatWithAI(messages, courseContext);

    return {
      success: true,
      response: aiResponse,
    };
  } catch (error) {
    console.error("Error in chat:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to get response. Please try again." };
  }
}
