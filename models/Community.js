const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    connectedUsers: {
        type: Array,
        default: [],
    },
    connectedReels: {
        type: Array,
        default: [],
    },
    likes: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  });
  
  module.exports = mongoose.model("Community", CommunitySchema);