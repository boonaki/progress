const mongoose = require("mongoose");

const ReelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reel: {
        type: mongoose.Schema.types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Reel", ReelSchema);