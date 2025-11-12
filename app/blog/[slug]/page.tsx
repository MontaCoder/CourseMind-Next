import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blog.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    return {
      title: "Post Not Found - CourseMind",
    };
  }

  return {
    title: `${post.title} - CourseMind Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

async function getBlogPost(slug: string) {
  const post = await db.blog.findUnique({
    where: { slug, published: true },
  });
  return post;
}

async function getRelatedPosts(category: string, currentSlug: string) {
  const posts = await db.blog.findMany({
    where: {
      published: true,
      category,
      slug: { not: currentSlug },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text">
              CourseMind
            </Link>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article */}
        <article>
          {/* Cover Image */}
          {post.image && (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Share Button */}
          <div className="flex gap-2 mb-8 pb-8 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Content */}
          <div
            className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    {relatedPost.image && (
                      <div className="relative w-full h-40 bg-muted">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <Badge variant="secondary" className="mb-2">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-bold mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Create your first AI-powered course in minutes. Available in 39 languages.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/#pricing">
              <Button size="lg" variant="outline">View Pricing</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CourseMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
