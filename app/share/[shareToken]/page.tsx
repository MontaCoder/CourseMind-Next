import { notFound } from "next/navigation";
import { getSharedCourse } from "@/actions/share";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Languages,
  Calendar,
  User,
  Eye,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function SharedCoursePage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const result = await getSharedCourse(shareToken);

  if (result.error || !result.share) {
    notFound();
  }

  const { course, viewCount, createdAt } = result.share;
  const chapters = course.chapters || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <ArrowLeft className="h-5 w-5" />
              CourseMind
            </Link>
            <Link href="/signup">
              <Button>Create Your Own Course</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Course Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
                {course.description && (
                  <p className="text-lg text-muted-foreground">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>{course.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By {course.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{viewCount} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Shared {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Note:</strong> This is a read-only view of a shared
                  course. To create your own courses with AI, notes, quizzes, and
                  certificates,{" "}
                  <Link
                    href="/signup"
                    className="underline font-medium text-primary"
                  >
                    sign up for free
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Course Content</h2>

          {chapters.map((chapter: any, index: number) => (
            <Card key={chapter.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Chapter {chapter.order + 1}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{chapter.title}</CardTitle>
                    {chapter.description && (
                      <CardDescription className="mt-2">
                        {chapter.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Chapter Topics */}
              {chapter.topics && chapter.topics.length > 0 && (
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="topics" className="border-none">
                      <AccordionTrigger className="text-sm py-2">
                        View Topics ({chapter.topics.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {chapter.topics.map((topic: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-0.5">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Footer */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Create Your Own AI-Powered Courses?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get instant access to course generation, AI tutors, interactive
              quizzes, note-taking, and certificates. Support for 39 languages.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 CourseMind. Powered by AI. Course shared from CourseMind
            platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
