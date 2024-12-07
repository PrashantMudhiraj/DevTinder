const express = require("express");
const validator = require("validator");
const { encryptPassword } = require("../utils/encryption");
const { adminAuth, userAuth, errorHandler } = require("../middlewares");
const { validateEditRequestData, validatePasswordUpdate, validateSignUpData, isValidStatus } = require("../utils/validation");


const User = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest")
const authRouter = express.Router();
const profileRouter = express.Router();
const requestRouter = express.Router();
const userRouter = express.Router()

module.exports = {
    authRouter,
    profileRouter,
    requestRouter,
    userRouter,
    validator,
    validateSignUpData,
    encryptPassword,
    User,
    ConnectionRequest,
    userAuth,
    validateEditRequestData,
    validatePasswordUpdate,
    encryptPassword,
    isValidStatus
};
