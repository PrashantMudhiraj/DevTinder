const {
    authRouter,
    validateSignUpData,
    encryptPassword,
    User,
    validator,
} = require("./index");

authRouter.post("/signup", async (req, res) => {
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
        console.log(error);
        res.status(400).send("Error saving the user: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            // throw new Error("Enter a valid Email Id");
            res.status(401).send("Invalid Email Id");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            // throw new Error("Invalid Credentails!!");
            res.status(401).send("Invalid Credentials");
        }
        // console.log(user)
        const isPasswordValid = await user.validatePassword(password);
        // console.log(isPasswordValid)
        if (isPasswordValid) {
            //Create a JWT Token
            const token = await user.getJWT();
            //Add JWt token in cookie
            // res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.cookie("token", token, { maxAge: 3.6e6 });
            res.send(user);
        } else {
            // throw new Error("Invalid Credentails!!");
            res.status(401).send("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    // console.log("/logout");
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    // });
    res.clearCookie("token");

    res.json("User logged out!!!");
});

module.exports = authRouter;
