import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Trophy } from "lucide-react";

interface CourseProgressProps {
  course: {
    progress: number;
    chapters?: any[];
  };
}

export function CourseProgress({ course }: CourseProgressProps) {
  const completedChapters = Math.floor(
    ((course.chapters?.length || 0) * course.progress) / 100
  );
  const totalChapters = course.chapters?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{course.progress}%</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Chapters Completed
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedChapters} / {totalChapters}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalChapters - completedChapters} remaining
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievement</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {course.progress === 100 ? "Complete!" : "In Progress"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {course.progress === 100
              ? "You completed this course"
              : "Keep learning!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
