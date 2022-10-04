const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    commenterName: {
        type: String,
        ref: "User",
    },
    commenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
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
  
  module.exports = mongoose.model("Comment", CommentSchema);