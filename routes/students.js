const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const router = express.Router();
const validateRegisterInput = require("../validation/studentRegister");
const validateLoginInput = require("../validation/login");// Load User model
const LiveClassModel = require("../models/LiveClass")
const StudentModel = require('../models/Student');

router.post('/register', async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('register', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            return res.json({ id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "student" })
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
    passport.authenticate('login', async (err, user, info) => {
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
                const payload = { id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "student" };// Sign token
                const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 2678400 /* 1 month in seconds*/ });
                return res.json({ success: true, token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});


router.get('/approvedliveclass', async (req, res, next) => {
    try {
        const liveClass = await LiveClassModel.find({ approved: true })
        //console.log(liveClass)
        res.json(liveClass)
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});

router.post('/registerliveclass/:studentid/:classid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const participants = {
            studentId: req.params.studentid
        }
        if (await LiveClassModel.findOne({ _id: req.params.classid, "participants.studentId": req.params.studentid })) {
            res.json({ message: 'Already registered', success: true })
        } else {
            await LiveClassModel.updateOne({ _id: req.params.classid }, { $push: { participants: participants } })
            res.json({ message: 'Successfully registered', success: true })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/myliveclass/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const myliveclasses = await LiveClassModel.find({ "participants.studentId": req.params.id })
        res.json(myliveclasses)
    }
    catch (err) {
        next(err)
    }
})

router.get('/joinliveclass/:studentid/:classid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {

        const found = await LiveClassModel.findOne({ _id: req.params.classid, "participants.studentId": req.params.studentid })
        if (!found) res.json({ message: "Not Authorized", success: false })
        else if (new Date(found.start_time) > new Date()) res.json({ message: "Please Wait Until Scheduled Time", success: false })
        else res.json({ message: 'Authization Complete', success: true })
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;