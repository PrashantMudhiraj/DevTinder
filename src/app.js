require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const { adminAuth, userAuth, errorHandler } = require("./middlewares");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        //Creating a new instance of the User model
        const user = new User(req.body);
        await user.save();
        res.send("signed up");
    } catch (error) {
        res.status(400).send("Error saving the user: " + error.message);
    }
});

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId;
        const user = await User.find({ emailId: userEmail });
        // const user = await User.findOne({ emailId: userEmail });
        // if(!user)
        if (user.length === 0) {
            res.status(404).send("User not Found");
        } else {
            res.send(user);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId;
        const dataToUpdate = req.body;
        const ALLOWED_UPDATES = ["age", "gender", "about", "skills", "photourl"];
        const isUpdatedAllowed = Object.keys(dataToUpdate).every((key) =>
            ALLOWED_UPDATES.includes(key)
        );
        console.log(userId)
        // console.log(isUpdatedAllowed);
        // if (!isUpdatedAllowed) {
        //     throw new Error("Update not allowed");
        // }
        // if (dataToUpdate?.skills.length >= 10) {
        //     throw new Error("More than 10 skills were not allowed");
        // } //API level validation
        const user = await User.findByIdAndUpdate(userId, dataToUpdate, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User Data updated");
    } catch (error) {
        console.log(error.message);
        res.status(400).send(`Updated failed : ${error.message}`);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        // console.log(user)
        // res.send("User deleted")
        if (!user) {
            res.status(404).send("User Not Found");
        } else {
            res.send("User deleted");
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Something went wrong");
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
