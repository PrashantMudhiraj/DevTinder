const validator = require("validator");

function validateSignUpData(req) {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter a valid firstName and lastname");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid Email id");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

function validateEditRequestData(requestToUpdateData) {
    const RESTRICTED_EDIT_FIELDS = ["password", "email"];

    const isEditAllowed = Object.keys(requestToUpdateData).every(
        (key) => !RESTRICTED_EDIT_FIELDS.includes(key)
    );

    return isEditAllowed;
}

function isValidStatus(type, status) {
    const ALLOWED_SEND_STATUS = ["interested", "ignored"];
    const ALLOWED_REVIEW_STATUS = ["accepted", "rejected"];

    if (type === "send") {
        return ALLOWED_SEND_STATUS.includes(status);
    } else if ((type = "review")) {
        return ALLOWED_REVIEW_STATUS.includes(status);
    }
}

async function validatePasswordUpdate(req) {
    const loggedInUser = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (!newPassword || !oldPassword)
        throw new Error("Please fill new and old password fields");

    const UPDATE_ALLOWED = ["oldPassword", "newPassword"];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
        UPDATE_ALLOWED.includes(key)
    );
    if (isUpdateAllowed) {
        const isPasswordMatched = await loggedInUser.validatePassword(
            oldPassword
        );
        if (oldPassword === newPassword)
            throw new Error(
                "The new password must be different from the old password."
            );

        return isPasswordMatched;
    }
    return isUpdateAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditRequestData,
    validatePasswordUpdate,
    isValidStatus
};
