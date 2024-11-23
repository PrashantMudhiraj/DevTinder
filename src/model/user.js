const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxLength: 30,
            minLength: 5,
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
        },
        about: {
            type: String,
            default: "about feild (Test)",
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

// const userModel = model("User", userSchema);

// module.exports = userModel;

module.exports = model("User", userSchema);
