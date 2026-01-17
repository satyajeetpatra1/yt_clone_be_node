import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    // Check if channel already exists for the user
    const existing = await Channel.findOne({ owner: req.user.id });

    // If channel exists
    if (existing) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    // Create new channel
    const channel = await Channel.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// Get my channel
export const getMyChannel = async (req, res) => {
  try {
    // Find channel by owner
    const channel = await Channel.findOne({ owner: req.user.id }).populate(
      "owner"
    );

    // If channel not found
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Find videos by channel
    const videos = await Video.find({ channel: channel._id }).sort({
      createdAt: -1,
    });

    res.json({ channel, videos });
  } catch {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};

// Get channel by ID
export const getChannelById = async (req, res) => {
  try {
    // Find channel by ID
    const channel = await Channel.findById(req.params.id).populate(
      "owner",
      "username"
    );

    // If channel not found
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Find videos by channel
    const videos = await Video.find({ channel: channel._id }).sort({
      createdAt: -1,
    });

    res.json({ channel, videos });
  } catch {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};

// Update channel by ID
export const updateChannel = async (req, res) => {
  try {
    // Find channel by ID
    const channel = await Channel.findById(req.params.id);

    // If channel not found
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if the logged-in user is the owner of the channel
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Update channel details
    Object.assign(channel, req.body);
    // Save updated channel
    await channel.save();
    
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to update channel" });
  } 
};
