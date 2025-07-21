// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: "String",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    image: {
      type: String,
      required: false, // optional profile image
    },
  }
);

module.exports = mongoose.model("User", userSchema);
