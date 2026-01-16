import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";

export const createChannel = async (req, res) => {
  try {
    const existing = await Channel.findOne({ owner: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    const channel = await Channel.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to create channel" });
  }
};

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.id }).populate(
      "owner"
    );

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channel._id }).sort({
      createdAt: -1,
    });

    res.json({ channel, videos });
  } catch {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate(
      "owner",
      "username"
    );

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channel._id }).sort({
      createdAt: -1,
    });

    res.json({ channel, videos });
  } catch {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    Object.assign(channel, req.body);
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to update channel" });
  } 
};
