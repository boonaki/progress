const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    followers: {
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  });
  
  module.exports = mongoose.model("Community", CommunitySchema);