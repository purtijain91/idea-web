const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  roomId: String, // combination of two user IDs
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
