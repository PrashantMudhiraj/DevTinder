require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const { adminAuth, userAuth, errorHandler } = require("./middlewares");
const User = require("./model/user");

const app = express();

app.post("/signup", async (req, res) => {
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
    res.send("signed up")
});

connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    })
    .catch(() => {
        console.log("Error in connecting to DB");
    });
