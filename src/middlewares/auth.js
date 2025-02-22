const jwt = require("jsonwebtoken");
const User = require("../model/user");

const adminAuth = (req, res, next) => {
    console.log("Admin Auth check");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("unautorized");
    } else {
        next();
    }
};

const userAuth = async (req, res, next) => {
    try {
        // const cookies = req.cookies;
        const { token } = req.cookies;
        console.log(token);

        // const { token } = cookies;
        if (!token) {
            // throw new Error("Please Login");
            return res.status(401).send("Please Login!");
        }
        //validate the token
        const { _id } = await jwt.verify(token, process.env.PRIVATE_KEY);
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("Please login again!!");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
};

module.exports = { adminAuth, userAuth };
