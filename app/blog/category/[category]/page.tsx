import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${formattedCategory} Articles - CourseMind Blog`,
    description: `Read articles about ${formattedCategory} on the CourseMind blog.`,
  };
}

async function getCategoryPosts(category: string) {
  const posts = await db.blog.findMany({
    where: {
      published: true,
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

async function getCategories() {
  const posts = await db.blog.findMany({
    where: { published: true },
    select: { category: true },
  });

  const categories = [...new Set(posts.map((p: any) => p.category))];
  return categories;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const posts = await getCategoryPosts(categoryName);
  const categories = await getCategories();

  if (posts.length === 0) {
    notFound();
  }

  const formattedCategory = posts[0].category; // Use the actual category name from the post for proper casing

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

      {/* Category Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {formattedCategory}
          </h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/blog">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  All Posts
                </Badge>
              </Link>
              {categories.map((category: string) => (
                <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
                  <Badge
                    variant={category.toLowerCase() === categoryName.toLowerCase() ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                {post.image && (
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime} min read
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Own Courses?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of learners using CourseMind to create AI-powered courses in 39 languages.
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
      <footer className="border-t mt-24 py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-text">CourseMind</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered course generation in 39 languages. Create, learn, and share knowledge.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-2">
                support@coursemind.com
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>&copy; 2025 CourseMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
