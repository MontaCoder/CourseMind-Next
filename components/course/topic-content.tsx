"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, RefreshCw, Loader2 } from "lucide-react";
import { generateTopicContent, toggleTopicCompletion, regenerateTopicContent } from "@/actions/topic";
import { toast } from "sonner";

interface TopicContentProps {
  topicId: string;
  courseId: string;
  courseType: "VIDEO_TEXT" | "TEXT_IMAGE";
  initialTopic: {
    id: string;
    title: string;
    theory: string | null;
    videoId: string | null;
    imageUrl: string | null;
    completed: boolean;
  };
}

export function TopicContent({
  topicId,
  courseId,
  courseType,
  initialTopic,
}: TopicContentProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);

  // Check if content needs to be generated
  const needsGeneration = !topic.theory || (courseType === "VIDEO_TEXT" ? !topic.videoId : !topic.imageUrl);

  // Auto-generate content on mount if needed
  useEffect(() => {
    if (needsGeneration && !isLoading) {
      handleGenerateContent();
    }
  }, [topicId]); // Only run when topicId changes

  const handleGenerateContent = async () => {
    setIsLoading(true);
    try {
      const result = await generateTopicContent(topicId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.topic) {
        setTopic(result.topic);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateContent = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateTopicContent(topicId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.topic) {
        setTopic(result.topic);
        toast.success("Content regenerated successfully!");
      }
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast.error("Failed to regenerate content. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleCompletion = async () => {
    setIsTogglingCompletion(true);
    try {
      const result = await toggleTopicCompletion(topicId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        setTopic({ ...topic, completed: result.completed });
        toast.success(result.completed ? "Topic marked as complete!" : "Topic marked as incomplete");
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
      toast.error("Failed to update completion status");
    } finally {
      setIsTogglingCompletion(false);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating content for you...</span>
          </div>

          {courseType === "VIDEO_TEXT" ? (
            <>
              <Skeleton className="w-full aspect-video rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </>
          ) : (
            <>
              <Skeleton className="w-full h-64 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleToggleCompletion}
          disabled={isTogglingCompletion}
          variant={topic.completed ? "outline" : "default"}
          className={
            topic.completed
              ? "border-green-600 text-green-600 hover:bg-green-50"
              : "bg-gradient-to-r from-primary to-accent"
          }
        >
          {isTogglingCompletion ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : topic.completed ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Circle className="mr-2 h-4 w-4" />
          )}
          {topic.completed ? "Completed" : "Mark as Complete"}
        </Button>

        <Button
          onClick={handleRegenerateContent}
          disabled={isRegenerating || isLoading}
          variant="outline"
          size="sm"
        >
          {isRegenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Regenerate Content
        </Button>
      </div>

      {/* Video Content (for VIDEO_TEXT courses) */}
      {courseType === "VIDEO_TEXT" && topic.videoId && (
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-t-lg"
                src={`https://www.youtube.com/embed/${topic.videoId}`}
                title={topic.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Content (for TEXT_IMAGE courses) */}
      {courseType === "TEXT_IMAGE" && topic.imageUrl && (
        <Card>
          <CardContent className="p-0">
            <img
              src={topic.imageUrl}
              alt={topic.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Theory Content */}
      {topic.theory && (
        <Card>
          <CardContent className="p-6">
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-7
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-ul:list-disc prose-ul:ml-6
                prose-ol:list-decimal prose-ol:ml-6
                prose-li:text-muted-foreground prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: topic.theory }}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !topic.theory && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Content couldn't be generated. Please try again.
            </p>
            <Button onClick={handleGenerateContent} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Generate Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
