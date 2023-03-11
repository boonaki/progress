const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
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
})

const ReelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: {
        type: Number,
        default: 0,
    },
    captures: [PostSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    stars: {
        type: Array,
        default: [],
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    userName: {
        type: String,
        default: true,
    }
});

module.exports = mongoose.model("Reel", ReelSchema);