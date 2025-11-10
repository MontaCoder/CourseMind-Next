import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogEditor } from "@/components/admin/blog-editor";

async function getBlogPost(id: string) {
  const post = await db.blog.findUnique({
    where: { id },
  });
  return post;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Edit Post</h2>
        <p className="text-muted-foreground">
          Update your blog post
        </p>
      </div>

      <BlogEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image || "",
          category: post.category,
          tags: post.tags,
          featured: post.featured,
          popular: post.popular,
          published: post.published,
        }}
      />
    </div>
  );
}
