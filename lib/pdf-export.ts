import jsPDF from "jspdf";

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

interface CourseData {
  name: string;
  description: string | null;
  language: string;
  progress: number;
  chapters: Chapter[];
}

/**
 * Strip HTML tags and decode HTML entities
 */
function stripHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');

  return text.trim();
}

/**
 * Split text into lines that fit within the page width
 */
function splitTextToLines(
  doc: jsPDF,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = doc.getTextWidth(testLine);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Export course content to PDF
 */
export async function exportCourseToPDF(
  courseData: CourseData,
  userName?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with automatic line wrapping
  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = splitTextToLines(doc, text, maxWidth);
    lines.forEach((line) => {
      checkPageBreak(fontSize / 2);
      doc.text(line, margin, yPosition);
      yPosition += fontSize / 2;
    });
  };

  // Title Page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(courseData.name, margin, yPosition);
  yPosition += 15;

  if (courseData.description) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const descLines = splitTextToLines(doc, courseData.description, maxWidth);
    descLines.forEach((line) => {
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  }

  // Course metadata
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Language: ${courseData.language}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Progress: ${courseData.progress}%`, margin, yPosition);
  yPosition += 6;

  if (userName) {
    doc.text(`Generated for: ${userName}`, margin, yPosition);
    yPosition += 6;
  }

  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Progress bar
  const barWidth = maxWidth;
  const barHeight = 8;
  checkPageBreak(barHeight + 5);

  // Background
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, yPosition, barWidth, barHeight, 'F');

  // Progress fill
  doc.setFillColor(102, 126, 234); // Primary color
  doc.rect(margin, yPosition, barWidth * (courseData.progress / 100), barHeight, 'F');

  yPosition += barHeight + 15;

  // Table of Contents
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Table of Contents', margin, yPosition);
  yPosition += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  courseData.chapters.forEach((chapter, chapterIndex) => {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${chapterIndex + 1}. ${chapter.title}`, margin + 5, yPosition);
    yPosition += 7;

    chapter.topics.forEach((topic, topicIndex) => {
      checkPageBreak(7);
      doc.setFont('helvetica', 'normal');
      const checkmark = topic.completed ? '✓' : '○';
      doc.text(`   ${chapterIndex + 1}.${topicIndex + 1} ${checkmark} ${topic.title}`, margin + 10, yPosition);
      yPosition += 6;
    });
    yPosition += 3;
  });

  // Course Content
  courseData.chapters.forEach((chapter, chapterIndex) => {
    doc.addPage();
    yPosition = margin;

    // Chapter header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(`Chapter ${chapterIndex + 1}: ${chapter.title}`, margin, yPosition);
    yPosition += 12;

    if (chapter.description) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80);
      const descLines = splitTextToLines(doc, chapter.description, maxWidth);
      descLines.forEach((line) => {
        checkPageBreak(7);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Chapter topics
    chapter.topics.forEach((topic, topicIndex) => {
      checkPageBreak(20);

      // Topic header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      const topicStatus = topic.completed ? '✓ ' : '';
      doc.text(`${chapterIndex + 1}.${topicIndex + 1} ${topicStatus}${topic.title}`, margin, yPosition);
      yPosition += 10;

      if (topic.description) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100);
        const descLines = splitTextToLines(doc, topic.description, maxWidth);
        descLines.forEach((line) => {
          checkPageBreak(6);
          doc.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
        yPosition += 3;
      }

      // Topic theory content
      if (topic.theory) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);

        const cleanText = stripHtml(topic.theory);
        const paragraphs = cleanText.split('\n').filter(p => p.trim());

        paragraphs.forEach((paragraph) => {
          checkPageBreak(10);
          const lines = splitTextToLines(doc, paragraph, maxWidth - 5);
          lines.forEach((line) => {
            checkPageBreak(5);
            doc.text(line, margin + 5, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        });
      } else {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text('Content not yet generated', margin + 5, yPosition);
        yPosition += 8;
      }

      yPosition += 5;

      // Separator line
      if (topicIndex < chapter.topics.length - 1) {
        checkPageBreak(5);
        doc.setDrawColor(200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      }
    });
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      courseData.name,
      margin,
      pageHeight - 10
    );
  }

  // Save the PDF
  const fileName = `${courseData.name.replace(/[^a-z0-9]/gi, '_')}_Course_Notes.pdf`;
  doc.save(fileName);
}
