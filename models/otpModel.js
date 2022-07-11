const mongoose = require("mongoose"),
  { Schema } = mongoose;

const otpSchema = new Schema({
  otp: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  expire: { type: Number, required: true },
});

const otp = mongoose.model("otp", otpSchema);

module.exports = otp;
