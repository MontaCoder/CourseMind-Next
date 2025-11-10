"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateCertificate } from "@/actions/certificate";
import { Download, Award, Loader2, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

interface CertificateCardProps {
  courseId: string;
  courseName: string;
  courseProgress: number;
  existingCertificate?: {
    id: string;
    certificateNumber: string;
    userName: string;
    issueDate: Date;
  } | null;
}

export function CertificateCard({
  courseId,
  courseName,
  courseProgress,
  existingCertificate,
}: CertificateCardProps) {
  const [certificate, setCertificate] = useState(existingCertificate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const result = await generateCertificate(courseId);

      if (result.error) {
        setError(result.error);
      } else if (result.certificate) {
        setCertificate(result.certificate);
      }
    } catch (error) {
      setError("Failed to generate certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!certificate) return;

    setIsDownloading(true);

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Certificate dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background with gradient effect (using rectangles)
      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Border
      doc.setDrawColor(99, 102, 241); // Primary color
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

      // Inner border
      doc.setDrawColor(168, 85, 247); // Accent color
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30, "S");

      // CourseMind Logo/Title
      doc.setFontSize(32);
      doc.setTextColor(99, 102, 241);
      doc.setFont("helvetica", "bold");
      doc.text("CourseMind", pageWidth / 2, 35, { align: "center" });

      // Certificate title
      doc.setFontSize(18);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Certificate of Completion", pageWidth / 2, 50, {
        align: "center",
      });

      // Award icon representation (using text)
      doc.setFontSize(40);
      doc.setTextColor(168, 85, 247);
      doc.text("★", pageWidth / 2, 70, { align: "center" });

      // "This certifies that" text
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.text("This certifies that", pageWidth / 2, 85, { align: "center" });

      // User name
      doc.setFontSize(24);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.text(certificate.userName, pageWidth / 2, 100, { align: "center" });

      // Completion text
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.text(
        "has successfully completed the course",
        pageWidth / 2,
        115,
        { align: "center" }
      );

      // Course name
      doc.setFontSize(18);
      doc.setTextColor(99, 102, 241);
      doc.setFont("helvetica", "bold");
      const courseNameLines = doc.splitTextToSize(courseName, pageWidth - 80);
      doc.text(courseNameLines, pageWidth / 2, 130, { align: "center" });

      // Issue date
      const issueDate = new Date(certificate.issueDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`Issued on ${issueDate}`, pageWidth / 2, 155, {
        align: "center",
      });

      // Certificate number
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Certificate No: ${certificate.certificateNumber}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );

      // Signature line (left side)
      doc.setLineWidth(0.5);
      doc.setDrawColor(150, 150, 150);
      doc.line(40, pageHeight - 35, 90, pageHeight - 35);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("CourseMind Platform", 65, pageHeight - 30, { align: "center" });

      // Save the PDF
      doc.save(
        `CourseMind-Certificate-${certificate.certificateNumber}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  // If course not completed
  if (courseProgress < 100) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            Certificate
          </CardTitle>
          <CardDescription>
            Complete this course to earn your certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{courseProgress}% Complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {100 - courseProgress}% remaining to unlock your certificate
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If certificate not yet generated
  if (!certificate) {
    return (
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Course Completed!
          </CardTitle>
          <CardDescription>
            Congratulations! Generate your certificate now
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Generate Certificate
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Certificate generated - show download option
  return (
    <Card className="border-primary bg-gradient-to-br from-primary/10 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certificate Ready
        </CardTitle>
        <CardDescription>
          Your certificate has been generated successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-medium">{certificate.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course:</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {courseName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issue Date:</span>
            <span className="font-medium">
              {new Date(certificate.issueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Certificate No:</span>
            <span className="font-mono text-xs">
              {certificate.certificateNumber}
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full"
          variant="default"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Download...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Certificate (PDF)
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Share your achievement on social media!
        </p>
      </CardContent>
    </Card>
  );
}
