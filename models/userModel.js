const mongoose = require("mongoose"),
  { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  course: [{ type: Schema.Types.ObjectId, ref: "course" }],
  verify: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now() },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
