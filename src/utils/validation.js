const validator = require("validator");

function validateSignUpData(req) {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter a valid firstName and lastname");
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Please enter a valid Email id')
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter a strong password')
    }
}


module.exports = {
    validateSignUpData
}