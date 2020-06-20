const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();
const validateRegisterInput = require("../validation/adminRegister");
const validateLoginInput = require("../validation/login");// Load User model
const StudentModel = require('../models/Student')
const MentorModel = require("../models/Mentor")
const LiveClassModel = require("../models/LiveClass")

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


router.get('/allStudents',passport.authenticate('jwtAdmin', { session: false }), async (req,res,next) =>{
    try{
        const allStudents = await StudentModel.find({},'_id name email institution subject');
        res.json(allStudents);
    } catch(err) {
        return next(err)
    } 
});

router.get('/allMentors',passport.authenticate('jwtAdmin', { session: false }), async (req,res,next) =>{
    try{
        const allMentors = await MentorModel.find({},'_id name email organization position mobileNo adminVerify');
        //console.log(allMentors)
        res.json(allMentors);
    } catch(err) {
        //console.log(err)
        return next(err)
    } 
});

router.get('/allMentors/:id',passport.authenticate('jwtAdmin', { session: false }), async (req,res,next) =>{
    try{
        const mentor = await MentorModel.findById(req.params.id);
        res.json(mentor);
    } catch(err) {
        return next(err)
    } 
});

router.put('/verifyMentor/:id',passport.authenticate('jwtAdmin', { session: false }), async (req,res,next) =>{
    try{
        const filter = { _id : req.params.id }
        const update = { adminVerify: true }
        await MentorModel.updateOne( filter, update );
        res.json({ message: "success"});
    } catch(err) {
        return next(err)
    } 
});

router.get('/allliveclass',passport.authenticate('jwtAdmin', { session: false }), async (req, res, next) => {
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
        const filter = { _id : req.params.id }
        const update = { approved: true}
        await LiveClassModel.updateOne(filter, update)
        res.json({ message: "success"});
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});



module.exports = router;