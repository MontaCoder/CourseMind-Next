"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { exportCourseToPDF } from "@/lib/pdf-export";
import { toast } from "sonner";

interface Topic {
  id: string;
  title: string;
  description: string | null;
  theory: string | null;
  completed: boolean;
  order: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  topics: Topic[];
  order: number;
}

interface PDFExportButtonProps {
  course: {
    id: string;
    name: string;
    description: string | null;
    language: string;
    progress: number;
    chapters: Chapter[];
  };
  userName?: string;
}

export function PDFExportButton({ course, userName }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating PDF...", {
        description: "This may take a few moments",
      });

      // Small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      await exportCourseToPDF(
        {
          name: course.name,
          description: course.description,
          language: course.language,
          progress: course.progress,
          chapters: course.chapters,
        },
        userName
      );

      toast.success("PDF exported successfully!", {
        description: "Your course notes have been downloaded",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF", {
        description: "Please try again later",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Export to PDF
        </>
      )}
    </Button>
  );
}
