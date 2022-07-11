const mongoose = require("mongoose"),
  { Schema } = mongoose;
const courseSchema = new Schema(
  {
    coursename: { type: String, required: true },
    category: { type: Array, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, default: "courseimg.png" },
  },
  { timestamps: true }
);
const course = mongoose.model("course", courseSchema);

module.exports = course;
