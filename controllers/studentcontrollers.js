const CourseModel = require('../models/Course')
const { CategoryModel, SubCategoryModel } = require("../models/Category");
const MentorModel = require('../models/Mentor');
const UserModel = require('../models/Student');

exports.getCourse = async (req, res) => {
    try {
        const courses = await CourseModel.find({ approved: true }).select('mentorId name description categories subcategories approved created price')
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

exports.completeCheckout = async (req, res) => {
    try {
        console.log(req.body)
        const student = await UserModel.findOne({ _id: req.body.userid })
        let newCourses = req.body.courses;
        let oldCourses = student.enrolledcourses;
        newCourses.forEach(course => oldCourses.push(course))

        await UserModel.updateOne({ _id: req.body.userid }, { enrolledcourses: oldCourses })
        res.json({ success: true, message: "Successfully enrolled for these courses" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.id }, 'name email institution subject date enrolledcourses')
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
        const course = await CourseModel.findOne({ _id: req.params.courseid })
        res.json({ success: true, course: course })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}