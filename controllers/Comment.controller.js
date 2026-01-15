import Comment from "../models/Comment.model.js";

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      video: req.params.videoId,
      user: req.user._id,
    });
    res.json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId }).populate(
      "user"
    );
    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
};
