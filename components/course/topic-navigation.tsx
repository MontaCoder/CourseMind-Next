"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TopicNavigationProps {
  courseId: string;
  chapterId: string;
  previousTopic: { id: string; title: string } | null;
  nextTopic: { id: string; title: string } | null;
  currentTopicId: string;
}

export function TopicNavigation({
  courseId,
  chapterId,
  previousTopic,
  nextTopic,
  currentTopicId,
}: TopicNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t">
      {/* Previous Topic */}
      <div className="flex-1">
        {previousTopic ? (
          <Link
            href={`/dashboard/courses/${courseId}/chapters/${chapterId}/topics/${previousTopic.id}`}
          >
            <Button variant="outline" className="w-full justify-start group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium truncate max-w-[200px]">
                  {previousTopic.title}
                </div>
              </div>
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Back to Chapter */}
      <Link href={`/dashboard/courses/${courseId}/chapters/${chapterId}`}>
        <Button variant="ghost" size="sm">
          All Topics
        </Button>
      </Link>

      {/* Next Topic */}
      <div className="flex-1">
        {nextTopic ? (
          <Link
            href={`/dashboard/courses/${courseId}/chapters/${chapterId}/topics/${nextTopic.id}`}
          >
            <Button
              variant="default"
              className="w-full justify-end group bg-gradient-to-r from-primary to-accent"
            >
              <div className="text-right">
                <div className="text-xs opacity-90">Next</div>
                <div className="font-medium truncate max-w-[200px]">
                  {nextTopic.title}
                </div>
              </div>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
