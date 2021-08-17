const express = require("express");
const Todo = require("../models/Todo");
const User = require("../models/User");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const user = req.user;
    if (!user){
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const todos = await Todo.find({user})
            res.send(todos)
    } catch (err) {
        return res.status(500).json({message: err})
    }
})

router.post("/", auth, async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({message: "Unauthorized"})
    }

    const {title, completed, priority} = req.body;
    if (!title) {
        return res.status(400).json({message: "Please enter a title"})
    }

    try {
        const newTodo = await new Todo({
            title,
            completed,
            priority,
            user
        });

        await newTodo.save();
        return res.status(200).send(newTodo);
    } catch (err){
        return res.status(500).send(err)
    }
});

router.put("/:id", auth, async (req, res) => {
    const user = req.user;
    if (!user){
        return res.status(401).json({message: "Unauthorized"})
    }

    // const {title, completed} = req.body;

    // if (!title){
    //     return res.status(400).json({message: "Please enter a title"})
    // }

    try {
        const updatedTodo = await Todo.findOneAndUpdate(req.params.id, 
            {
                title: req.body.title, 
                completed: req.body.completed,
                priority: req.body.priority,
                user
            }, (error, data) => {
            if (error){
                console.log(error)
                return res.status(400).send(error)
            } else {
                console.log(data)
            }
        })
        return res.status(200).json(updatedTodo)
    } catch (err){
        console.log(err)
        return res.status(500).send(err)
    }
})


router.delete("/:id", auth, async (req, res) => {
    const user = req.user;
    if (!user){
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const toBeDeleted = await Todo.findByIdAndRemove(req.params.id)
        // console.log(toBeDeleted);
        return res.status(200).json(toBeDeleted)

    } catch (error){
        console.log(err)
        return res.status(500).send(err)
    }
})




















module.exports = router;