"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Languages, Calendar, Trash2 } from "lucide-react";
import { searchImages, type UnsplashImage } from "@/lib/unsplash";
import { ShareCourseDialog } from "@/components/course/share-course-dialog";

interface CourseHeaderProps {
  course: {
    id: string;
    name: string;
    description: string | null;
    language: string;
    createdAt: Date;
    progress: number;
    _count?: {
      chapters: number;
    };
    chapters?: any[];
  };
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const [courseImage, setCourseImage] = useState<UnsplashImage | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      try {
        const images = await searchImages(course.name, 1);
        if (images.length > 0) {
          setCourseImage(images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course image:", error);
      } finally {
        setIsLoadingImage(false);
      }
    }

    fetchImage();
  }, [course.name]);

  const chapterCount = course._count?.chapters || course.chapters?.length || 0;

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* Course Image */}
        <div className="relative h-64 md:h-auto bg-muted">
          {isLoadingImage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : courseImage ? (
            <>
              <Image
                src={courseImage.thumbnailUrl}
                alt={course.name}
                fill
                className="object-cover"
              />
              {courseImage.photographer && (
                <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  Photo by{" "}
                  <a
                    href={courseImage.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {courseImage.photographer}
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            {course.description && (
              <p className="text-muted-foreground">{course.description}</p>
            )}
          </div>

          {/* Course Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>
                {chapterCount} chapter{chapterCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>{course.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Created {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <ShareCourseDialog courseId={course.id} courseName={course.name} />
            <Button variant="outline" size="sm" className="text-destructive" disabled>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
