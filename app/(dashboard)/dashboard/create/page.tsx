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
import { Loader2, Sparkles, BookOpen, Languages } from "lucide-react";
import { createCourse } from "@/actions/course";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { CourseType } from "@/types/course";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [chapterCount, setChapterCount] = useState(5);
  const [courseType, setCourseType] = useState<CourseType>("TEXT_IMAGE");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("language", language);
    formData.append("chapterCount", chapterCount.toString());
    formData.append("courseType", courseType);

    try {
      const result = await createCourse(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to the new course
      if ("courseId" in result && result.courseId) {
        setIsLoading(false);
        await router.push(`/dashboard/courses/${result.courseId}`);
        return;
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pt-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
        <p className="text-muted-foreground mt-2">
          Generate an AI-powered course on any topic in your preferred language
        </p>
      </div>

      <div>
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

              {/* Course Type */}
              <div className="space-y-2">
                <Label htmlFor="courseType">Course Type</Label>
                <Select
                  value={courseType}
                  onValueChange={(value) => setCourseType(value as CourseType)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT_IMAGE">Text + Image</SelectItem>
                    <SelectItem value="VIDEO_TEXT">Video + Text</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how lessons should be delivered
                </p>
              </div>

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="chapterCount">Number of Chapters</Label>
                  <span className="text-xs text-muted-foreground">
                    {chapterCount} chapters
                  </span>
                </div>
                <input
                  id="chapterCount"
                  type="range"
                  min={3}
                  max={10}
                  value={chapterCount}
                  onChange={(e) => setChapterCount(parseInt(e.target.value))}
                  disabled={isLoading}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
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
