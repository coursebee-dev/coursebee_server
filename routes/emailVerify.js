const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const Student = require("../models/Student")
const Mentor = require("../models/Mentor")
const Admin = require("../models/Admin")


router.get('/send', async (req, res) => {
    try {
        if (req.query.sync_code !== process.env.SYNC_CODE) {
            throw Error("request code doesn't match");
        }
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: `${process.env.GMAIL_USER}`,
                pass: `${process.env.GMAIL_PASS}`
            }
        });
        const payload = { email: req.query.email, type: req.query.type };// Sign token
        const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: 2678400 /* 1 month in seconds*/ });
        const link = "http://" + req.get('host') + "/api/email/verify?token=" + token;
        //console.log(link)
        const mailOptions = {
            to: req.query.email,
            //to: `${process.env.GMAIL_USER}`,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        //console.log(mailOptions);
        const info = await transporter.sendMail(mailOptions);
        res.json({ message: "email sent" })
        console.log("accepted by " + info.accepted);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
});

router.get('/verify', async (req, res) => {
    try {
        const decoded = jwt.verify(req.query.token, process.env.EMAIL_SECRET)
        if (decoded.type === "student") {
            await Student.findOneAndUpdate({ email: decoded.email }, { emailVerify: true })
            res.redirect(req.headers.origin + "/login")
        } else if (decoded.type === "mentor") {
            await Mentor.findOneAndUpdate({ email: decoded.email }, { emailVerify: true })
            res.redirect(req.headers.origin + "/mentor/login")
        } else if (decoded.type === "admin") {
            await Admin.findOneAndUpdate({ email: decoded.email }, { emailVerify: true })
            res.redirect(req.headers.origin + "/admin/login")
        }
        res.redirect(req.headers.origin)
    } catch (error) {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
});

router.get('/forgotpass', async (req, res) => {
    try {
        if (req.query.sync_code !== process.env.SYNC_CODE) {
            throw Error("request code doesn't match");
        }
        //console.log(req);

        let reqUser = null;
        if (req.query.type === 'student') {
            reqUser = await Student.findOne({ name: req.query.name, email: req.query.email })
        } else if (req.query.type === 'mentor') {
            reqUser = await Mentor.findOne({ name: req.query.name, email: req.query.email })
        } else if (req.query.type === 'admin') {
            reqUser = await Admin.findOne({ name: req.query.name, email: req.query.email })
        }
        if (!reqUser) {
            throw Error("Username or email doesn't match");
        }
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: `${process.env.GMAIL_USER}`,
                pass: `${process.env.GMAIL_PASS}`
            }
        });
        const payload = { id: reqUser.id, type: req.query.type };// Sign token
        const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: 600 /* 10 minutes in seconds*/ });
        const link = req.headers.origin + "/changepass/" + token;
        console.log(link)
        const mailOptions = {
            to: req.query.email,
            //to: `${process.env.GMAIL_USER}`,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        //console.log(mailOptions);
        res.json({ message: "Email sent" })
        //const info = await transporter.sendMail(mailOptions);
        //console.log("accepted by " + info.accepted);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/changepassverify', async (req, res) => {
    try {
        jwt.verify(req.query.token, process.env.EMAIL_SECRET)
        res.json({ message: "success" })
    } catch (error) {
        console.log(error);
        res.end("<h1>Bad Request</h1>");
    }
});

router.get('/changepass', async (req, res) => {
    try {
        //console.log(req.query)
        const decoded = jwt.verify(req.query.token, process.env.EMAIL_SECRET)
        let reqUser = null;
        if (decoded.type === "student") {
            reqUser = await Student.findById(decoded.id)
            reqUser.password = req.query.password
            reqUser.save()
            res.json({ message: "success" })
        } else if (decoded.type === "mentor") {
            reqUser = await Mentor.findById(decoded.id)
            reqUser.password = req.query.password
            reqUser.save()
            res.json({ message: "success" })
        } else if (decoded.type === "admin") {
            reqUser = await Admin.findById(decoded.id)
            reqUser.password = req.query.password
            reqUser.save()
            res.json({ message: "success" })
        } else {
            res.json({ message: "fail" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "fail" })
    }
});
module.exports = router;