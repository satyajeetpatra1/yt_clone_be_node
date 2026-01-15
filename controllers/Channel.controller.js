import Channel from "../models/Channel.model.js";

export const createChannel = async (req, res) => {
  try {
    const channel = await Channel.create({
      ...req.body,
      owner: req.user._id,
    });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
