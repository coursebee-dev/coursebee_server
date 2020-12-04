const CourseModel = require('../models/Course')
const { CategoryModel, SubCategoryModel } = require("../models/Category");
const MentorModel = require('../models/Mentor');

exports.getCourse = async (req, res) => {
    try {
        const courses = await CourseModel.find({ approved: true })
        res.json({ success: true, courses: courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        res.json({ success: true, categories: categories })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getMentorName = async (req, res) => {
    try {
        const mentor = await MentorModel.findOne({ _id: req.params.id })
        res.json({ success: true, name: mentor.name })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}