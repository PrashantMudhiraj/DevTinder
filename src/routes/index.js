const express = require("express");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const { encryptPassword } = require("../utils/encryption");
const { adminAuth, userAuth, errorHandler } = require("../middlewares");

const User = require("../model/user");
const authRouter = express.Router();
const profileRouter = express.Router();
const requestRouter = express.Router();

module.exports = {
    authRouter,
    profileRouter,
    requestRouter,
    validator,
    validateSignUpData,
    encryptPassword,
    User,
    userAuth,
};
