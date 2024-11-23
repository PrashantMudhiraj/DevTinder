const bcrypt = require("bcrypt");

async function encryptPassword(password) {
    return bcrypt.hash(password, 10);
}

module.exports = { encryptPassword };
