const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    mobile: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
