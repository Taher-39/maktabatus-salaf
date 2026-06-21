const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID =
    process.env.YOUTUBE_CHANNEL_ID || "UC4O1Z8_GsQVYX-HmhQrNSAA"; // Default to example ID

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoId: string;
    publishedAt: string;
}

interface SnippetThumbnails {
    maxres?: { url: string };
    high?: { url: string };
    medium?: { url: string };
    default?: { url: string };
}

interface Snippet {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: SnippetThumbnails;
    resourceId?: { videoId: string };
}

interface PlaylistItem {
    snippet: Snippet;
}

interface ChannelContentDetails {
    relatedPlaylists?: { uploads?: string };
}

interface ChannelItem {
    contentDetails?: ChannelContentDetails;
}

interface ChannelsApiResponse {
    items?: ChannelItem[];
}

interface PlaylistItemsApiResponse {
    items?: PlaylistItem[];
}

// Helper function to build query params
function buildQueryString(params: Record<string, string | number>): string {
    return Object.entries(params)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");
}

export async function fetchChannelVideos(
    maxResults: number = 6
): Promise<YouTubeVideo[]> {
    try {
        if (!YOUTUBE_API_KEY) {
            console.warn("YouTube API key not configured");
            return [];
        }

        // Get upload playlist ID
        const channelParams = buildQueryString({
            part: "contentDetails",
            id: CHANNEL_ID,
            key: YOUTUBE_API_KEY,
        });

        const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?${channelParams}`
        );

        if (!channelRes.ok) {
            console.warn(`Failed to fetch channel: ${channelRes.statusText}`);
            return [];
        }

        const channelData = (await channelRes.json()) as ChannelsApiResponse;
        const uploadPlaylistId =
            channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadPlaylistId) {
            console.warn("Could not find upload playlist");
            return [];
        }

        // Get videos from upload playlist
        const videosParams = buildQueryString({
            part: "snippet",
            playlistId: uploadPlaylistId,
            maxResults,
            key: YOUTUBE_API_KEY,
        });

        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?${videosParams}`
        );

        if (!videosRes.ok) {
            console.warn(`Failed to fetch videos: ${videosRes.statusText}`);
            return [];
        }

        const videosData = (await videosRes.json()) as PlaylistItemsApiResponse;

        const videos: YouTubeVideo[] =
            videosData.items?.map((item: PlaylistItem) => {
                const videoId = item.snippet.resourceId?.videoId ?? "";
                const thumbs = item.snippet.thumbnails;
                const thumbnail =
                    thumbs.maxres?.url ||
                    thumbs.high?.url ||
                    thumbs.medium?.url ||
                    thumbs.default?.url ||
                    "";

                return {
                    id: videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail,
                    videoId,
                    publishedAt: item.snippet.publishedAt,
                };
            }) || [];

        return videos;
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}
