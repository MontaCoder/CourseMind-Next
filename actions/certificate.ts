"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function generateCertificate(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get course details
    const course = await db.course.findUnique({
      where: { id: courseId, userId: session.user.id },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Check if course is completed
    if (course.progress !== 100) {
      return { error: "Complete the course to earn a certificate" };
    }

    // Check if certificate already exists
    const existingCertificate = await db.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    });

    if (existingCertificate) {
      return { certificate: existingCertificate };
    }

    // Generate unique certificate number
    const certificateNumber = `CM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        courseName: course.name,
        userName: session.user.name || "User",
        certificateNumber: certificateNumber,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { certificate };
  } catch (error) {
    console.error("Error generating certificate:", error);
    return { error: "Failed to generate certificate" };
  }
}

export async function getCertificate(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const certificate = await db.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      include: {
        course: true,
      },
    });

    return { certificate };
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return { error: "Failed to fetch certificate" };
  }
}

export async function getUserCertificates() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const certificates = await db.certificate.findMany({
      where: { userId: session.user.id },
      include: {
        course: true,
      },
      orderBy: { issueDate: "desc" },
    });

    return { certificates };
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return { error: "Failed to fetch certificates" };
  }
}
