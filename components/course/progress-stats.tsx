"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourseStatistics, getAchievementBadges, getMotivationalMessage } from "@/lib/progress";
import { BookOpen, CheckCircle, Trophy, Target } from "lucide-react";

interface Topic {
  id: string;
  completed: boolean;
}

interface Chapter {
  id: string;
  topics: Topic[];
}

interface ProgressStatsProps {
  chapters: Chapter[];
}

export function ProgressStats({ chapters }: ProgressStatsProps) {
  const stats = getCourseStatistics(chapters);
  const badges = getAchievementBadges(stats.overallProgress, stats.completedTopics);
  const motivationalMessage = getMotivationalMessage(stats.overallProgress);

  return (
    <div className="space-y-6">
      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{motivationalMessage}</p>
              <p className="text-sm text-muted-foreground">
                Keep learning and achieve your goals!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {stats.overallProgress}%
              </span>
            </div>
            <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Completed Topics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Topics Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {stats.completedTopics}
              </span>
              <span className="text-muted-foreground">/ {stats.totalTopics}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalTopics - stats.completedTopics} remaining
            </p>
          </CardContent>
        </Card>

        {/* Completed Chapters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Chapters Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {stats.completedChapters}
              </span>
              <span className="text-muted-foreground">/ {stats.totalChapters}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalChapters - stats.completedChapters} in progress
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">
                {badges.length}
              </span>
              <span className="text-muted-foreground">earned</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep learning to unlock more!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800"
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
