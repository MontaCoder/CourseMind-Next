import { generateTopicTheory } from "@/lib/gemini";
import { searchVideos } from "@/lib/youtube";
import { searchImages } from "@/lib/unsplash";
import { markdownToHtml } from "@/lib/ai/markdown";

export type CourseContentType = "TEXT_IMAGE" | "VIDEO_TEXT";

export interface TopicContentContext {
  title: string;
  description?: string | null;
  chapterTitle: string;
  language: string;
  courseType: CourseContentType;
}

export interface TopicContentResult {
  theoryHtml: string;
  videoId: string | null;
  imageUrl: string | null;
}

export async function generateTopicContentForContext(
  context: TopicContentContext
): Promise<TopicContentResult> {
  const { title, description, chapterTitle, language, courseType } = context;

  if (courseType === "VIDEO_TEXT") {
    const [videos, theoryMarkdown] = await Promise.all([
      searchVideos(`${title} ${chapterTitle} tutorial`, 1),
      generateTopicTheory(title, description || "", chapterTitle, language),
    ]);

    const videoId = videos.length > 0 ? videos[0].id : null;
    const theoryHtml = markdownToHtml(theoryMarkdown);

    return {
      theoryHtml,
      videoId,
      imageUrl: null,
    };
  }

  const [theoryMarkdown, images] = await Promise.all([
    generateTopicTheory(title, description || "", chapterTitle, language),
    searchImages(`${title} ${chapterTitle} example`, 1),
  ]);

  const imageUrl = images.length > 0 ? images[0].url : null;
  const theoryHtml = markdownToHtml(theoryMarkdown);

  return {
    theoryHtml,
    videoId: null,
    imageUrl,
  };
}
