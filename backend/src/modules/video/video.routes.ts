import { Router } from "express";
import { fetchChannelVideos } from "../../utils/youtube.service";

const router = Router();

// GET /api/v1/videos - Get promotional videos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const videos = await fetchChannelVideos(limit);

    res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
