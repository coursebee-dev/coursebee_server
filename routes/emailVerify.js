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
        //console.log(req.query)
        const mailOptions = {
            to: req.query.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        //console.log(mailOptions);
        res.json({ message: "email sent"})
        const info = await transporter.sendMail(mailOptions);
        console.log("accepted by " + info.accepted);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
});

router.get('/verify', async (req, res) => {
    try {
        const decoded = jwt.verify(req.query.token, process.env.EMAIL_SECRET)
        if(decoded.type==="student"){
            await Student.findOneAndUpdate({email:decoded.email}, {emailVerify: true} )
            res.redirect("https://coursebee.com/login")
        } else if(decoded.type==="mentor"){
            await Mentor.findOneAndUpdate({email:decoded.email}, {emailVerify: true} )
            res.redirect("https://coursebee.com/mentor/login")
        } else if(decoded.type==="admin"){
            await Admin.findOneAndUpdate({email:decoded.email}, {emailVerify: true} )
            res.redirect("https://coursebee.com/admin/login")
        }
        res.redirect("https://coursebee.com")
    } catch (error) {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
});

module.exports = router;