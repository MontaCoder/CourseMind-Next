import { db } from "@/lib/db";

/**
 * Get all users with their subscriptions and course counts
 */
export async function getAllUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          courses: true,
        },
      },
    },
  });
}

/**
 * Get all courses with user information
 */
export async function getAllCourses() {
  return db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts() {
  return db.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get all contact submissions
 */
export async function getAllContactSubmissions() {
  return db.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats() {
  const [
    totalUsers,
    totalCourses,
    totalBlogs,
    totalContacts,
    recentUsers,
    recentCourses,
    recentSubscriptions,
  ] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.blog.count(),
    db.contact.count(),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    db.course.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    db.subscription.findMany({
      where: {
        plan: {
          in: ["MONTHLY", "YEARLY"],
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        plan: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalBlogs,
    totalContacts,
    recentUsers,
    recentCourses,
    recentSubscriptions,
  };
}

/**
 * Get user statistics for admin users page
 */
export async function getUserStats() {
  const [users, adminCount, paidCount] = await Promise.all([
    getAllUsers(),
    db.user.count({ where: { role: "ADMIN" } }),
    db.subscription.count({
      where: {
        status: "ACTIVE",
        plan: {
          in: ["MONTHLY", "YEARLY"],
        },
      },
    }),
  ]);

  return {
    users,
    totalUsers: users.length,
    adminCount,
    paidCount,
    freeUsers: users.length - paidCount,
  };
}

/**
 * Get course statistics for admin courses page
 */
export async function getCourseStats() {
  const [courses, videoCount, imageCount] = await Promise.all([
    getAllCourses(),
    db.course.count({ where: { courseType: "VIDEO_TEXT" } }),
    db.course.count({ where: { courseType: "TEXT_IMAGE" } }),
  ]);

  return {
    courses,
    totalCourses: courses.length,
    videoCount,
    imageCount,
  };
}

/**
 * Get blog statistics for admin blog page
 */
export async function getBlogStats() {
  const [posts, publishedCount, draftCount] = await Promise.all([
    getAllBlogPosts(),
    db.blog.count({ where: { published: true } }),
    db.blog.count({ where: { published: false } }),
  ]);

  return {
    posts,
    totalPosts: posts.length,
    publishedCount,
    draftCount,
  };
}

/**
 * Get contact statistics for admin contact page
 */
export async function getContactStats() {
  const [contacts, resolvedCount, pendingCount] = await Promise.all([
    getAllContactSubmissions(),
    db.contact.count({ where: { resolved: true } }),
    db.contact.count({ where: { resolved: false } }),
  ]);

  return {
    contacts,
    totalContacts: contacts.length,
    resolvedCount,
    pendingCount,
  };
}
