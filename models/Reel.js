const mongoose = require("mongoose");

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
    captures: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    stars: {
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model("Reel", ReelSchema);