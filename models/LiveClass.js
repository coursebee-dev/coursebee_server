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
    start_date: {
        type: Date,
    },
    time: {
        type: String,
        required: true
    },
    end_date: {
        type: Date
    },
    duration: {
        type: Number,
        required: true
    },
    academicExcellence: {
        type: String
    },
    category: [],
    subcategory: [],
    classtime: [],
    approved: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    class_schedule: {
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
