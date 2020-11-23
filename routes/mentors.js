const express = require('express');
const passport = require('passport');
//const axios = require('axios')

const jwt = require('jsonwebtoken');
const router = express.Router();
const validateRegisterInput = require("../validation/mentorRegister");
const validateLoginInput = require("../validation/login");
const MentorModel = require("../models/Mentor")
const LiveClassModel = require("../models/LiveClass")
const { CategoryModel, SubCategoryModel } = require("../models/Category");
const CourseModel = require('../models/Course');
const { getVimeoAuthUrl } = require('../auth/vimeomentorauth')

router.post('/register', async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    console.log(req.body)
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('registerMentor', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                console.log(err)
                return res.status(400).json(info)
            }
            return res.json({ id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, adminVerify: user.adminVerify, type: "mentor" })
        } catch (error) {
            console.log(error)
            return next(error);
        }
    })(req, res, next);
});


router.post('/login', async (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);// Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('loginMentor', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                //console.log(user)
                const payload = { id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, adminVerify: user.adminVerify, type: "mentor" };// Sign token
                const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 2678400 /* 1 month in seconds*/ });
                return res.json({ success: true, token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/profile', passport.authenticate('jwtMentor', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});

router.post('/scheduleclass/:id', passport.authenticate('jwtMentor', { session: false }), async (req, res, next) => {

    try {
        //console.log(req.body)
        // await LiveClassModel.create(req.body);
        console.log(req.body)
        const liveClass = new LiveClassModel(req.body)
        liveClass.save()
        res.json({ message: 'success' })
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});

router.get('/liveclass/:id', passport.authenticate('jwtMentor', { session: false }), async (req, res, next) => {
    try {
        const liveClass = await LiveClassModel.find({ mentorId: req.params.id })
        //console.log(liveClass)
        res.json(liveClass)
    }
    catch (err) {
        //console.log(err)
        return next(err);
    }
});

router.get('/mentorinfo/:id', async (req, res) => {
    try {
        const mentor = await MentorModel.findOne({ _id: req.params.id })
        console.log(mentor)
        res.json({
            name: mentor.name,
            organization: mentor.organization,
            position: mentor.position
        })
    } catch (error) {
        res.json(error)
    }
})

router.patch('/edit/:id', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        const mentor = await MentorModel.findOneAndUpdate({})
    } catch (error) {
        res.json(error)
    }
})

router.post('/uploadimg/:mentorid', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        const mentor = await MentorModel.findOne({ _id: req.params.mentorid })
        console.log(req.body)
        res.json(req.body)
    } catch (error) {
        res.json(error)
    }
})

router.get('/category', async (req, res) => {
    try {
        const category = await CategoryModel.find();
        res.send(category);
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/createcourse', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        const course = new CourseModel(req.body)
        await course.save()
        res.json({ success: true, message: "success" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.get('/course', async (req, res) => {
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

router.get('/vimeoauthurl', async (req, res) => {
    try {
        let url = getVimeoAuthUrl()
        res.json({ success: true, url: url })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
})

router.put('/course/:id/addvideo', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        await CourseModel.updateOne({ _id: req.params.id }, { $push: { contents: req.body } })
        res.json({ success: true, message: 'Successfully added a course content' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/course/:id/submit', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        await CourseModel.updateOne({ _id: req.params.id }, { $set: { submitted: true } })
        res.json({ success: true, message: 'Successfully submitted course for review.' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/course/:id/changename', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        await CourseModel.updateOne({ _id: req.params.id }, { $set: { name: req.body.coursename } })
        res.json({ success: true, message: 'Successfully changed course name' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/append/:courseId/:contentId', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        console.log(req.body)
        await CourseModel.findOneAndUpdate({ "_id": req.params.courseId, 'contents._id': req.params.contentId }, { "$set": { "contents.$.videoobject": req.body } })
        res.json({ success: true, message: 'Successfully uploaded video' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put('/video/delete/:courseId/:contentId', passport.authenticate('jwtMentor', { session: false }), async (req, res) => {
    try {
        await CourseModel.findOneAndUpdate({ "_id": req.params.courseId, 'contents._id': req.params.contentId }, { "$set": { "contents.$.videoobject": {} } })
        res.json({ success: true, message: 'Successfully deleted content' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

module.exports = router;