const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  postText: {
    type: String,
    required: [true, "Provide post text"],
  },
  postImage: String,
});

const Posts = new mongoose.model("posts", postSchema);

module.exports = Posts;
