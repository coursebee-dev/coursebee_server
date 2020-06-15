const mongoose = require("mongoose");

const Schema = mongoose.Schema;// Create Schema


const LiveClass = new Schema({
    mentorId:{
        type:String,
        required:true
    },
    topic: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    agenda: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    meetingid: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model("LiveClass", LiveClass);
