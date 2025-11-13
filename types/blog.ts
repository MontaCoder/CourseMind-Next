/**
 * Shared Blog type definitions
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminBlogPost extends BlogPost {
  // Add any additional admin-specific fields here
}
