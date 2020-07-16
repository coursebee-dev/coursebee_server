const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema

const LiveClass = new Schema({
    mentorId: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    class_type: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        default: 0
    },
    participants: []
})

module.exports = mongoose.model("LiveClass", LiveClass);
