"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { saveNote, deleteNote, getNote } from "@/actions/notes";
import { Loader2, Save, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseNotesProps {
  courseId: string;
}

export function CourseNotes({ courseId }: CourseNotesProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing note
  useEffect(() => {
    async function loadNote() {
      try {
        const result = await getNote(courseId);
        if (result.error) {
          setError(result.error);
        } else if (result.note) {
          setContent(result.note.content);
          setLastSaved(new Date(result.note.updatedAt));
        }
      } catch (error) {
        setError("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();
  }, [courseId]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
    setSuccess("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("content", content);

    try {
      const result = await saveNote(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Notes saved successfully");
        setHasChanges(false);
        setLastSaved(new Date());
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete all your notes for this course?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteNote(courseId);

      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        setHasChanges(false);
        setLastSaved(null);
        setSuccess("Notes deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to delete notes");
    } finally {
      setIsDeleting(false);
    }
  };

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (!hasChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 30000);

    return () => clearTimeout(timer);
  }, [content, hasChanges]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Course Notes
            </CardTitle>
            <CardDescription>
              Take notes while learning. Your notes are automatically saved.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              size="sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            {content && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground">
            {success}
          </div>
        )}

        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Start taking notes about this course..."
        />

        {lastSaved && (
          <p className="text-xs text-muted-foreground">
            Last saved: {lastSaved.toLocaleString()}
          </p>
        )}
        {hasChanges && (
          <p className="text-xs text-muted-foreground">
            You have unsaved changes. Will auto-save in 30 seconds.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
