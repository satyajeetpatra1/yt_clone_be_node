import Video from "../models/Video.model.js";

// Get videos with optional category filter
export const getVideos = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    // Apply category filter if provided
    if (category && category !== "All") {
      filter.category = category;
    }

    // Fetch videos with channel info, sorted by creation date descending
    const videos = await Video.find(filter)
      .populate("channel", "channelName avatar")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

// Search videos by title
export const searchVideos = async (req, res) => {
  try {
    // Get search query from request
    const { q } = req.query;

    // If no query provided, return empty array
    if (!q) {
      return res.json([]);
    }

    // Find videos with titles matching the query
    const videos = await Video.find({
      title: { $regex: q, $options: "i" },
    })
      .populate("channel", "channelName avatar")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

// Get video by ID and increment view count
export const getVideoById = async (req, res) => {
  try {
    // Find video by ID and increment views
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true } // return the updated document
    ).populate("channel", "channelName avatar");

    // If video not found
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching video", error: error.message });
  }
};

// Create a new video
export const createVideo = async (req, res) => {
  try {
    // Create new video
    const video = await Video.create(req.body);

    res.json(video);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating video", error: error.message });
  }
};

// Like a video
export const likeVideo = async (req, res) => {
  try {
    // Find video by ID
    const video = await Video.findById(req.params.id);
    // Check if video exists
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // remove dislike if exists
    video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);

    // toggle like
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(userId);
    }

    // Save the updated video document
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to like video" });
  }
};

// Dislike a video
export const dislikeVideo = async (req, res) => {
  try {
    // Find video by ID
    const video = await Video.findById(req.params.id);
    // Check if video exists
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // remove like if exists
    video.likes = video.likes.filter((id) => id.toString() !== userId);

    // toggle dislike
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes.push(userId);
    }

    // Save the updated video document
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike video" });
  }
};

// Update video by ID
export const updateVideo = async (req, res) => {
  try {
    // Find video by ID
    const videoById = await Video.findById(req.params.id);

    // Check if video exists
    if (!videoById) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if the logged-in user is the owner of the video
    if (videoById.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update video details
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(video);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating video", error: error.message });
  }
};

// Delete video by ID
export const deleteVideo = async (req, res) => {
  try {
    // Find video by ID
    const video = await Video.findById(req.params.id).populate("channel");

    // Check if video exists
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if the logged-in user is the owner of the video
    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete the video
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting video", error: error.message });
  }
};
