import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { BlogManagementTable } from "@/components/admin/blog-management-table";

async function getBlogPosts() {
  const posts = await db.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Blog Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage blog posts
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{drafts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Table */}
      <BlogManagementTable posts={posts} />
    </div>
  );
}
