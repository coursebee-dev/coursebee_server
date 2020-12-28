const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const axios = require('axios');
const router = express.Router();
const validateRegisterInput = require("../validation/adminRegister");
const validateLoginInput = require("../validation/login");// Load User model
const StudentModel = require('../models/Student')
const MentorModel = require("../models/Mentor")
const LiveClassModel = require("../models/LiveClass")
const CourseModel = require('../models/Course')
const { CategoryModel, SubCategoryModel } = require("../models/Category");
router.post('/register', async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('registerAdmin', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            return res.json({ id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "admin" })
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


router.post('/login', async (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);// Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('loginAdmin', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                //console.log(user.id)
                const payload = { id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "admin" };// Sign token
                const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 2678400 /* 1 month in seconds*/ });
                return res.json({ success: true, token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/profile', passport.authenticate('jwtAdmin', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});


router.get('/allStudents', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const allStudents = await StudentModel.find({}, '_id name email institution subject');
        res.json(allStudents);
    } catch (err) {
        return next(err)
    }
});

router.get('/allMentors', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const allMentors = await MentorModel.find({}, '_id name email organization position mobileNo adminVerify');
        //console.log(allMentors)
        res.json(allMentors);
    } catch (err) {
        //console.log(err)
        return next(err)
    }
});

router.get('/allMentors/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const mentor = await MentorModel.findById(req.params.id);
        res.json(mentor);
    } catch (err) {
        return next(err)
    }
});

router.put('/verifyMentor/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const filter = { _id: req.params.id }
        const update = { adminVerify: true }
        await MentorModel.updateOne(filter, update);
        res.json({ message: "success" });
    } catch (err) {
        return next(err)
    }
});

router.get('/allliveclass', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const liveClass = await LiveClassModel.find({})
        //console.log(liveClass)
        res.json(liveClass)
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});



router.put('/approvelive/:id', passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
    try {
        const filter = { _id: req.params.id }
        const update = { approved: true }
        await LiveClassModel.updateOne(filter, update)
        res.json({ message: "success" });
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});

//category

router.get('/category', async (req, res) => {
    try {
        const category = await CategoryModel.find();
        res.send(category);
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/addcategory', async (req, res) => {
    try {
        const category = new CategoryModel(req.body);
        category.save()
        res.json({ message: 'success' })
    } catch (error) {
        res.send(error)
    }
})

router.post('/addsubcat/:id', async (req, res) => {
    try {
        const subcategory = new SubCategoryModel(req.body)
        await CategoryModel.updateOne({ _id: req.params.id }, { $push: { subcategory: subcategory } })
        res.json({ message: 'success' })
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/get/courses/', async (req, res) => {
    try {
        const courses = await CourseModel.find()
        res.json({ success: true, courses: courses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.get('/getcourse/:id', async (req, res) => {
    try {
        const course = await CourseModel.findOne({ _id: req.params.id })
        res.json({ success: true, course: course })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/course/:id/approve', passport.authenticate('jwtAdmin', { session: false }), async (req, res) => {
    try {
        const course = await CourseModel.updateOne({ _id: req.params.id }, { $set: { approved: true } })
        res.json({ success: true, message: "Approved course successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/approve/:courseId/:contentId', passport.authenticate('jwtAdmin', { session: false }), async (req, res) => {
    try {
        await CourseModel.findOneAndUpdate({ "_id": req.params.courseId, 'contents._id': req.params.contentId }, { "$set": { "contents.$.ready": true } })
        res.json({ success: true, message: 'Successfully approved content' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/disapprove/:courseId/:contentId', passport.authenticate('jwtAdmin', { session: false }), async (req, res) => {
    try {
        await CourseModel.findOneAndUpdate({ "_id": req.params.courseId, 'contents._id': req.params.contentId }, { "$set": { "contents.$.ready": false } })
        res.json({ success: true, message: 'Successfully disapproved content' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/setprice/:id', async (req, res) => {
    try {
        await CourseModel.updateOne({ _id: req.params.id }, { $set: { price: Number(req.body.price) } })
        res.json({ success: true, message: 'Successfully set price for video' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/final/add/:courseId/:contentId', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        await CourseModel.findOneAndUpdate({ "_id": req.params.courseId, 'contents._id': req.params.contentId }, { "$set": { "contents.$.finalLink": req.body.link } })
        res.json({ success: true, message: 'Successfully set final content' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

module.exports = router;