const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);
const video = mongoose.model("video", videoSchema);
module.exports = video;
