const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["guest", "host"],
    default: "guest",
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      default: [],
    },
  ],
  reserves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      default: [],
    },
  ],
  booked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      default: [],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
