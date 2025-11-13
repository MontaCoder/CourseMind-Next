/**
 * Shared Course type definitions
 */

export interface AdminCourse {
  id: string;
  name: string;
  description: string | null;
  language: string;
  courseType: "TEXT_IMAGE" | "VIDEO_TEXT";
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  shares?: {
    id: string;
    isPublic: boolean;
  }[];
  _count: {
    chapters: number;
  };
}

export interface CourseWithChapters {
  id: string;
  name: string;
  description: string | null;
  language: string;
  courseType: "TEXT_IMAGE" | "VIDEO_TEXT";
  progress: number;
  coverImage: string | null;
  createdAt: Date;
  chapters: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    topics: {
      id: string;
      title: string;
      completed: boolean;
    }[];
  }[];
}

export interface CourseOutline {
  name: string;
  description: string;
  chapters: {
    title: string;
    description: string;
    topics: {
      title: string;
      description: string;
    }[];
  }[];
}

export type CourseType = "TEXT_IMAGE" | "VIDEO_TEXT";
