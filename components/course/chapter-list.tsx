"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, CheckCircle2, Circle } from "lucide-react";
import { calculateChapterProgress } from "@/lib/progress";

interface Topic {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  topics: Topic[];
  order: number;
}

interface ChapterListProps {
  courseId: string;
  chapters: Chapter[];
  currentProgress: number;
}

export function ChapterList({
  courseId,
  chapters,
  currentProgress,
}: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => {
        const chapterProgress = calculateChapterProgress(chapter.topics);
        const isCompleted = chapterProgress === 100;
        const isInProgress = chapterProgress > 0 && chapterProgress < 100;
        const completedTopics = chapter.topics.filter(t => t.completed).length;

        return (
          <Card
            key={chapter.id}
            className={
              isInProgress
                ? "border-primary shadow-lg shadow-primary/10"
                : isCompleted
                  ? "border-green-500/50"
                  : ""
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : isInProgress ? (
                      <PlayCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      Chapter {chapter.order + 1}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {completedTopics}/{chapter.topics.length} topics
                    </span>
                  </div>
                  <CardTitle className="text-xl">{chapter.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {chapter.description}
                  </CardDescription>

                  {/* Progress Bar */}
                  {chapter.topics.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-semibold text-primary">{chapterProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-green-600"
                              : "bg-gradient-to-r from-primary to-accent"
                          }`}
                          style={{ width: `${chapterProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Link href={`/dashboard/courses/${courseId}/chapters/${chapter.id}`}>
                  <Button
                    size="sm"
                    variant={isInProgress ? "default" : "outline"}
                    className={
                      isInProgress
                        ? "bg-gradient-to-r from-primary to-accent"
                        : isCompleted
                          ? "border-green-600 text-green-600 hover:bg-green-50"
                          : ""
                    }
                  >
                    {isCompleted
                      ? "Review"
                      : isInProgress
                        ? "Continue"
                        : "Start"}
                  </Button>
                </Link>
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
                        {chapter.topics.map((topic) => (
                          <li
                            key={topic.id}
                            className="text-sm flex items-start gap-2"
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <span className="text-primary mt-0.5">•</span>
                            )}
                            <div className="flex-1">
                              <span className={topic.completed ? "text-muted-foreground line-through" : ""}>
                                {topic.title}
                              </span>
                              {topic.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {topic.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
