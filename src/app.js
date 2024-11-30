require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/requests.js')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)


connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Error in connecting to DB", err.message);
    });
