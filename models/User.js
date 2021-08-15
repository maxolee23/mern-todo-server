const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        min: 1
    },
    lastName: {
        type: String,
        min: 1
    },
    email: {
        type: String,
        min: 5
    },
    password: {
        type: String,
        min: 6
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo"
    }]
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;