// const express = require("express");
//const { adminAuth, userAuth, errorHandler } = require("./middlewares");

// const app = express();


// //middlewares
// //Handle Auth middleware for all requests.
// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//     //Logic of fetching all data
//     //Logic of checking if the request is authorized
//     res.send("All Data Sent!");
// });

// app.get("/admin/deleteUser", (req, res) => {
//     //Logic of delete User
//     //Logic of checking if the request is authorized

//     res.send("User Deleted!");
// });

// app.get("/getUserData", userAuth, (req, res, next) => {
//     //Logic of DB call and get user Data.
//     throw new Error("dummy Error");
//     res.send("User Data sent");
// });

// app.use(errorHandler);


//GET /users => It checks all the app.xxx("matching routes") functions
// Middleware chain => route/request handler => send response back
//Below route will not allow other routes why because each and every route will match "/" path
//code is executed in sequence
// app.get("/user", (req, res) => {
//     console.log(req.query);
//     res.send("Hello this is dashboard");
// });

// app.get("/userId/:id", (req, res) => {
//     console.log(req.params);
//     res.send("Hello this is get id");
// });

// app.get("/test", (req, res) => {
//     res.send("Hello from the server");
// });

// app.post("/user", (req, res) => {
//     res.send({ name: "Prashant" });
// });

// app.delete("/user", (req, res) => {
//     res.send("deleted successfully");
// });

// //expressions
// app.get("/ab?c", (req, res) => {
//     res.send("expression /ab?c");
// });

// app.get("/ab+c", (req, res) => {
//     res.send("expression /ab+c");
// });
// app.get("/ab*cd", (req, res) => {
//     res.send("expression /ab*cd");
// });

// //grouping
// app.get("/a(bc)?d", (req, res) => {
//     res.send("expression /ab*cd");
// });

// app.get("/a(bc)+d", (req, res) => {
//     res.send("expression /ab*cd");
// });

// //regex
// // app.get(/a/, (req, res) => {
// //     res.send("regex expression valdation");
// // });

// // app.get(/.*fly$/, (req, res) => {
// //     res.send("regex expression valdation");
// // });

// //Route Handler
// app.use("/routeHandler", (req, res) => {
//     //route handler
//     res.send("this is route handler");
// });

// //multiple route handler

// app.use(
//     "/multiplerouteHandler",
//     (req, res, next) => {
//         //route handler
//         // res.send("this is route handler 1"); //break and return response
//         console.log("Router handler 1");
//         // next("hello"); //error
//         next();
//     },
//     (req, res, next) => {
//         //route handler
//         // res.send("this is route handler 1"); //break and return response
//         console.log("Router handler 2");

//         // next("hello"); //error
//         next();
//     },
//     (req, res) => {
//         // console.log(req)
//         console.log("Router handler 3");

//         res.send("this is route handler 2");
//         // next() // throw an error -> cannot GET /user, because there is no route handler.
//     }
// );

// //same routes
// app.get("/user1", (req, res, next) => {
//     console.log("Router handler 1");
//     next();
// });

// app.get("/user1", (req, res, next) => {
//     console.log("Router handler 2");
//     res.send("Router handler 2");
// });

// //It will not be executed
// app.get("/user1", (req, res, next) => {
//     console.log("Router handler 3");
//     next();
// });

//works in same way if we wrap in a array
// app.use('/route', [rh1, rh2, rh3, rh4])
// app.use('/route', [rh1, rh2], rh3, rh4)

// app.listen(3000, () => {
//     console.log("Server is successfully listening on port 3000");
// });


// -----------------------------------------------------
require("dotenv").config();
const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { connectDB } = require("./config/database");
const { adminAuth, userAuth, errorHandler } = require("./middlewares");
const { validateSignUpData } = require("./utils/validation");
const { encryptPassword } = require("./utils/encryption");

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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(isPasswordValid)
        if (isPasswordValid) {
            //Create a JWT Token
            const token = await jwt.sign(
                {
                    _id: user._id,
                },
                "DEVTinder@Prash123"
            );
            //Add JWt token in cookie
            res.cookie("token", token);
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
        // console.log(req.user)
        res.send("profile reverted");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
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
        // console.log(isUpdatedAllowed);
        if (!isUpdatedAllowed) {
            throw new Error("Update not allowed");
        }
        // if (dataToUpdate?.skills.length >= 10) {
        //     throw new Error("More than 10 skills were not allowed");
        // } //API level validation
        const user = await User.findByIdAndUpdate(userId, dataToUpdate, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User Data updated");
    } catch (error) {
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
