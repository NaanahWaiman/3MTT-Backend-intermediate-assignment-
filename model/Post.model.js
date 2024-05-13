const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A Blog Post must have a title"],
    },
    description: {
      type: String,
      required: [true, "A Blog Post must have a description"],
    },
    tags: [String],
    readCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    body: {
      type: String,
      required: [true, "A Blog Post must contain a body"],
    },
    readTime: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
