import Video from "../models/Video.model.js";

export const getVideos = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .populate("channel", "channelName avatar")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

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

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("channel", "channelName avatar");

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

export const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.json(video);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating video", error: error.message });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
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

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to like video" });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
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

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike video" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const videoById = await Video.findById(req.params.id);
    if (!videoById) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (videoById.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

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

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting video", error: error.message });
  }
};
