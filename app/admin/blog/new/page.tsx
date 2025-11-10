import { BlogEditor } from "@/components/admin/blog-editor";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Create New Post</h2>
        <p className="text-muted-foreground">
          Write and publish a new blog post
        </p>
      </div>

      <BlogEditor />
    </div>
  );
}
