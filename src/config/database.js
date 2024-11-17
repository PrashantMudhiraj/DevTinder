const mongoose = require("mongoose");

const DB_PASS = process.env.MONGO_DB_PASSWORD

async function connectDB() {
    await mongoose.connect(
        `mongodb+srv://prashantmdrj446:${DB_PASS}@nodejs-mern.w57cf.mongodb.net/devTinder`
    );
}

module.exports = { connectDB };
