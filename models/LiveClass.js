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
    class_type: {
        type: String,
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
    approved: {
        type: Boolean,
        default: false
    },
    participants:[
        {
            studentId:{
                type: String,
                required: true
            }
        }
    ]
})

module.exports = mongoose.model("LiveClass", LiveClass);
