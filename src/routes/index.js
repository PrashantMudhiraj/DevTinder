const express = require("express");
const validator = require("validator");
const { encryptPassword } = require("../utils/encryption");
const { adminAuth, userAuth, errorHandler } = require("../middlewares");
const { validateEditRequestData, validatePasswordUpdate, validateSignUpData } = require("../utils/validation");


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
    validateEditRequestData,
    validatePasswordUpdate,
    encryptPassword
};
