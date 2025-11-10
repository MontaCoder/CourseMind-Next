"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCourseShare,
  deleteCourseShare,
  getCourseShare,
} from "@/actions/share";
import { Share2, Copy, Loader2, Trash2, Check, Eye } from "lucide-react";

interface ShareCourseDialogProps {
  courseId: string;
  courseName: string;
}

export function ShareCourseDialog({
  courseId,
  courseName,
}: ShareCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [share, setShare] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadShare();
    }
  }, [open]);

  const loadShare = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getCourseShare(courseId);
      if (result.error) {
        setError(result.error);
      } else if (result.share) {
        setShare(result.share);
      }
    } catch (error) {
      setError("Failed to load share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShare = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await createCourseShare(courseId);
      if (result.error) {
        setError(result.error);
      } else if (result.share) {
        setShare(result.share);
      }
    } catch (error) {
      setError("Failed to create share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShare = async () => {
    if (!share) return;

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteCourseShare(share.id);
      if (result.error) {
        setError(result.error);
      } else {
        setShare(null);
      }
    } catch (error) {
      setError("Failed to delete share link");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = async () => {
    if (!share) return;

    const shareUrl = `${window.location.origin}/share/${share.shareToken}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Course</DialogTitle>
          <DialogDescription>
            Share "{courseName}" with others via a public link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading && !share ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : share ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-link"
                    value={`${window.location.origin}/share/${share.shareToken}`}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{share.viewCount} views</span>
                </div>
                <div>
                  Created {new Date(share.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/share/${share.shareToken}`, "_blank")}
                  className="flex-1"
                >
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteShare}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Link
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Anyone with this link can view your course content (read-only).
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Create a shareable link to allow others to view this course. The
                link will remain active until you delete it.
              </p>
              <Button
                onClick={handleCreateShare}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Create Share Link
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
