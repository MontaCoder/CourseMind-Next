if (!process.env.YOUTUBE_API_KEY) {
  console.warn("YOUTUBE_API_KEY is not set. Video search will not work.");
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

export interface YouTubeTranscript {
  text: string;
  start: number;
  duration: number;
}

/**
 * Search for videos on YouTube based on query
 */
export async function searchVideos(
  query: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API not configured, returning placeholder videos");
    return [];
  }

  try {
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY);
    searchUrl.searchParams.append("q", query);
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("maxResults", maxResults.toString());
    searchUrl.searchParams.append("videoEmbeddable", "true");
    searchUrl.searchParams.append("videoCategoryId", "27"); // Education category

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Get video IDs for additional details
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",");

    // Fetch video details for duration and view count
    const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    detailsUrl.searchParams.append("key", YOUTUBE_API_KEY);
    detailsUrl.searchParams.append("id", videoIds);
    detailsUrl.searchParams.append("part", "contentDetails,statistics");

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = await detailsResponse.json();

    const detailsMap = new Map(
      detailsData.items?.map((item: any) => [
        item.id,
        {
          duration: item.contentDetails?.duration,
          viewCount: item.statistics?.viewCount,
        },
      ]) || []
    );

    return data.items.map((item: any) => {
      const details = detailsMap.get(item.id.videoId) as { duration?: string; viewCount?: string } | undefined;
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details?.duration,
        viewCount: details?.viewCount,
      };
    });
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
}

/**
 * Get video embed URL
 */
export function getVideoEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get video watch URL
 */
export function getVideoWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Format ISO 8601 duration to readable format
 */
export function formatDuration(isoDuration?: string): string {
  if (!isoDuration) return "N/A";

  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "N/A";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `0:${seconds.toString().padStart(2, "0")}`;
  }
}

/**
 * Format view count to readable format
 */
export function formatViewCount(viewCount?: string): string {
  if (!viewCount) return "N/A";

  const count = parseInt(viewCount);

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  } else {
    return `${count} views`;
  }
}

/**
 * Get video transcript (captions)
 * Note: This requires the YouTube Captions API which has stricter permissions
 * For now, we'll return null as captions require OAuth consent
 */
export async function getVideoTranscript(
  videoId: string
): Promise<YouTubeTranscript[] | null> {
  // Note: Getting transcripts requires OAuth 2.0 authentication
  // This is a placeholder for future implementation
  console.warn("Video transcript feature requires OAuth 2.0 authentication");
  return null;
}
