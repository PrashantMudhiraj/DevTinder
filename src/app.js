require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const { adminAuth, userAuth, errorHandler } = require("./middlewares");
const User = require("./model/user");

const app = express();

app.post("/signup", async (req, res) => {
    try {
        const userObj = {
            firstName: "Prashant",
            lastName: "Chevula",
            age: 25,
            password: "1234567890",
            emailId: "xyz@gmail.com",
        };
        //Creating a new instance of the User model
        const user = new User(userObj);
        await user.save();
        res.send("signed up");
    } catch (error) {
        res.status(400).send("Error saving the user: " + error.message);
    }
});

connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Error in connecting to DB", err.message);
    });
