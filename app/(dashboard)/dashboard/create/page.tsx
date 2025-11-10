"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, BookOpen, Languages, Hash } from "lucide-react";
import { createCourse } from "@/actions/course";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [chapterCount, setChapterCount] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("language", language);
    formData.append("chapterCount", chapterCount.toString());

    try {
      const result = await createCourse(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to the new course
      router.push(`/dashboard/courses/${result.courseId}`);
      router.refresh();
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Generate an AI-powered course on any topic in your preferred language
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Tell us what you want to learn and we'll create a personalized course
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic">Course Topic</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="topic"
                    name="topic"
                    type="text"
                    placeholder="e.g., Introduction to Machine Learning"
                    className="pl-10"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={3}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter any topic you want to learn about
                </p>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <div className="relative">
                  <Languages className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Course content will be generated in this language
                </p>
              </div>

              {/* Chapter Count */}
              <div className="space-y-2">
                <Label htmlFor="chapterCount">Number of Chapters</Label>
                <div className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="chapterCount"
                      name="chapterCount"
                      type="number"
                      className="pl-10"
                      value={chapterCount}
                      onChange={(e) =>
                        setChapterCount(parseInt(e.target.value) || 5)
                      }
                      min={3}
                      max={10}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={chapterCount}
                    onChange={(e) => setChapterCount(parseInt(e.target.value))}
                    disabled={isLoading}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose between 3 and 10 chapters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating your course...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Course
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Preview Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle>What You'll Get</CardTitle>
            <CardDescription>
              AI-powered course features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 p-2 h-fit">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Structured Chapters</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Well-organized content progressing from basics to advanced
                    topics
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 p-2 h-fit">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">AI-Generated Content</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comprehensive course material created by advanced AI
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 p-2 h-fit">
                  <Languages className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Multi-language Support</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Learn in your preferred language from 39+ options
                  </p>
                </div>
              </div>
            </div>

            {topic && (
              <div className="mt-6 p-4 rounded-lg bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <p className="font-medium text-sm">{topic}</p>
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 rounded">
                    {language}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 rounded">
                    {chapterCount} chapters
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Creating Your Course
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI is generating a comprehensive course outline with{" "}
                    {chapterCount} chapters in {language}. This may take 30-60
                    seconds...
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
