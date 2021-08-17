const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");


const PORT = process.env.PORT;
const MONGO_CONNECT = process.env.MONGO_CONNECT;

//middleware
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", userRoutes);
app.use(todoRoutes);


app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})


mongoose.connect(MONGO_CONNECT, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true}, () => {
    console.log("Connected to DB")
})