import { createApi } from "unsplash-js";

if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.warn("UNSPLASH_ACCESS_KEY is not set. Image search will not work.");
}

const unsplash = process.env.UNSPLASH_ACCESS_KEY
  ? createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    })
  : null;

export interface UnsplashImage {
  id: string;
  url: string;
  downloadUrl: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  description: string | null;
}

/**
 * Search for images on Unsplash based on query
 */
export async function searchImages(
  query: string,
  count: number = 1
): Promise<UnsplashImage[]> {
  if (!unsplash) {
    // Return placeholder images if Unsplash is not configured
    console.warn("Unsplash API not configured, using placeholder images");
    return Array.from({ length: count }, (_, i) => ({
      id: `placeholder-${i}`,
      url: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`,
      downloadUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`,
      thumbnailUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80`,
      photographer: "Unsplash",
      photographerUrl: "https://unsplash.com",
      description: query,
    }));
  }

  try {
    const result = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: count,
      orientation: "landscape",
    });

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      throw new Error("Failed to fetch images from Unsplash");
    }

    const photos = result.response?.results || [];

    return photos.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      downloadUrl: photo.links.download,
      thumbnailUrl: photo.urls.small,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      description: photo.description || photo.alt_description,
    }));
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    // Return placeholder on error
    return Array.from({ length: count }, (_, i) => ({
      id: `placeholder-${i}`,
      url: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`,
      downloadUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`,
      thumbnailUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80`,
      photographer: "Unsplash",
      photographerUrl: "https://unsplash.com",
      description: query,
    }));
  }
}

/**
 * Get a random image for a specific topic
 */
export async function getRandomImage(topic: string): Promise<UnsplashImage> {
  const images = await searchImages(topic, 1);
  return images[0];
}
