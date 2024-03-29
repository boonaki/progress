const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageLink: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    //might not be neccessary
    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel'
    },
    reelName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    extLink: {
        type: String,
    },
    extLinkInfo: {
        type: Object,
        default: {}
    },
    caption: {
        type: String,
        required: true,
    },
    likes: {
        type: Object,
        default: {},
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    userName: {
        type: String,
        ref: 'User'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", PostSchema);
