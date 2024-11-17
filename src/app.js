const express = require("express");

const app = express();

//Below route will not allow other routes why because each and every route will match "/" path
//code is executed in sequence
app.get("/user", (req, res) => {
    console.log(req.query);
    res.send("Hello this is dashboard");
});

app.get("/userId/:id", (req, res) => {
    console.log(req.params);
    res.send("Hello this is get id");
});

app.get("/test", (req, res) => {
    res.send("Hello from the server");
});

app.post("/user", (req, res) => {
    res.send({ name: "Prashant" });
});

app.delete("/user", (req, res) => {
    res.send("deleted successfully");
});

//expressions
app.get("/ab?c", (req, res) => {
    res.send("expression /ab?c");
});

app.get("/ab+c", (req, res) => {
    res.send("expression /ab+c");
});
app.get("/ab*cd", (req, res) => {
    res.send("expression /ab*cd");
});

//grouping
app.get("/a(bc)?d", (req, res) => {
    res.send("expression /ab*cd");
});

app.get("/a(bc)+d", (req, res) => {
    res.send("expression /ab*cd");
});

//regex
// app.get(/a/, (req, res) => {
//     res.send("regex expression valdation");
// });

// app.get(/.*fly$/, (req, res) => {
//     res.send("regex expression valdation");
// });
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});

//Route Handler
app.use("/routeHandler", (req, res) => {
    //route handler
    res.send("this is route handler");
});

//multiple route handler

app.use(
    "/multiplerouteHandler",
    (req, res, next) => {
        //route handler
        // res.send("this is route handler 1"); //break and return response
        console.log("Router handler 1");
        // next("hello"); //error
        next();
    },
    (req, res, next) => {
        //route handler
        // res.send("this is route handler 1"); //break and return response
        console.log("Router handler 2");

        // next("hello"); //error
        next();
    },
    (req, res) => {
        // console.log(req)
        console.log("Router handler 3");

        res.send("this is route handler 2");
        // next() // throw an error -> cannot GET /user, because there is no route handler.
    }
);

//works in same way if we wrap in a array
// app.use('/route', [rh1, rh2, rh3, rh4])
// app.use('/route', [rh1, rh2], rh3, rh4)