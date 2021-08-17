const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
    // validation
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    if (!(firstName || lastName || email || password || confirmPassword)){
        return res.status(400).json({message: "Please fill out all the input fields."})
    }

    if (password !== confirmPassword){
        return res.status(400).json({message: "Make sure your passwords match."})
    }

    const existingEmail = await User.findOne({email});
    if (existingEmail){
        return res.status(400).json({message: "Email already exists in the database"})
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        // return res.status(200).send(newUser)
        const token = jwt.sign({user: savedUser._id}, process.env.JWT_SECRET, {expiresIn: "1hr"});

        res.cookie("token", token, {
            httpOnly: true
        }).send();

    } catch (err){
        console.log(err)
        return res.status(500).json({message: err})
    }
})

router.post("/login", async (req, res) => {
    //validation
    const {email, password} = req.body;

    if (!(email || password)){
        return res.status(400).json({message: "Please fill out all the input fields."})
    }

    const existingUser = await User.findOne({email});

    if (!existingUser){
        return res.status(400).json({message: "Invalid email or password"})
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch){
        return res.status(400).json({message: "Invalid email or password"})
    }

    try {
        const token = jwt.sign({user: existingUser._id}, process.env.JWT_SECRET);
        // res.cookie(token).send("sign in successful")
        return res.cookie("token", token, {
            secure: false,
            httpOnly: true
        }).send()
    } catch (err){
        console.log(err);
        return res.status(500).json({message: err})
    }
})

router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
})

router.get("/loggedin", (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.send(true)
        } catch (err){
        console.error(err);
        res.send(false);
    }
})



module.exports = router;