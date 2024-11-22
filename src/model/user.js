const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "about feild (Test)"
    },
    skills: {
        type: [String]
    }
});

// const userModel = model("User", userSchema);

// module.exports = userModel;

module.exports = model("User", userSchema);
