const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxLength: 30,
            minLength: 3,
            index: true
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Not a Valid Email");
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(password) {
                if (!validator.isStrongPassword(password)) {
                    throw new Error("Enter strong password")
                }
            }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender data not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            validate(url) {
                if (!validator.isURL(url)) {
                    throw new Error("Not a valid URL")
                }
            }
        },
        about: {
            type: String,
            default: "about field (Test)",
            validate(value) {
                if (value.length > 100) {
                    throw new Error("length of about field should not exceed 100 letters")
                }
            }
        },
        skills: {
            type: [String],
            validate(values) {
                if (values.length > 10)
                    throw new Error("Skills more than 10 were not allowed");
            }, //schema level validation
        },
    },
    { timestamps: true }
);


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY, {
        expiresIn: "1d",
    });
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid
}


// const userModel = model("User", userSchema);

// module.exports = userModel;

module.exports = model("User", userSchema);
