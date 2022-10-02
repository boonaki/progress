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
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
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
        type: Number,
        default: 0,
    },
    userName: {
        type: String,
        ref: 'User'
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
