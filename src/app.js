const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

//middlewares
//Handle Auth middleware for all requests.
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res, next) => {
    res.send("User Data sent");
});

app.get("/admin/getAllData", (req, res) => {
    //Logic of fetching all data
    //Logic of checking if the request is authorized
    res.send("All Data Sent!");
});

app.get("/admin/deleteUser", (req, res) => {
    //Logic of delete User
    //Logic of checking if the request is authorized

    res.send("User Deleted!");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});
