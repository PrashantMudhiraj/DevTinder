require("dotenv").config();
const express = require("express");
const validator = require("validator");
const User = require("./model/user");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");
const { adminAuth, userAuth, errorHandler } = require("./middlewares");
const { validateSignUpData } = require("./utils/validation");
const { encryptPassword } = require("./utils/encryption");
const user = require("./model/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, skills, about } =
            req.body; //validate req.body
        validateSignUpData(req);
        //Encrypt password
        const passwordHash = await encryptPassword(password);
        // console.log(passwordHash);
        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            skills,
            about,
        });
        await user.save();
        res.send("signed up");
    } catch (error) {
        res.status(400).send("Error saving the user: " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Enter a valid Email Id");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentails!!");
        }
        // console.log(user)
        const isPasswordValid = await user.validatePassword(password)
        // console.log(isPasswordValid)
        if (isPasswordValid) {
            //Create a JWT Token
            const token = await user.getJWT()
            //Add JWt token in cookie
            // res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.cookie("token", token, { maxAge: 3.6e+6 });
            res.send("Login Successful!!");
        } else {
            throw new Error("Invalid Credentails!!");
        }
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        console.log(req.user);
        res.send("profile reverted");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

app.post("/sendConnectionRequest", userAuth, (req, res, next) => {
    try {
        const user = req.user;
        res.send(`${user.firstName} sent a connection request`);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
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
