const express = require("express");

const app = express();


//Below route will not allow other routes why because each and every route will match "/" path
//code is executed in sequence 
app.get("/user", (req, res) => {
    console.log(req.query)
    res.send("Hello this is dashboard");
});

app.get("/userId/:id", (req, res) => {
    console.log(req.params)
    res.send("Hello this is get id");
});

app.get("/test", (req, res) => {
    res.send("Hello from the server");
});

app.post("/user", (req, res) => {
    res.send({ "name": "Prashant" })
})

app.delete("/user", (req, res) => {
    res.send('deleted successfully')
})

//expressions
app.get("/ab?c", (req, res) => {
    res.send('expression /ab?c')
})

app.get("/ab+c", (req, res) => {
    res.send('expression /ab+c')
})
app.get("/ab*cd", (req, res) => {
    res.send('expression /ab*cd')
})

//grouping
app.get("/a(bc)?d", (req, res) => {
    res.send('expression /ab*cd')
})

app.get("/a(bc)+d", (req, res) => {
    res.send('expression /ab*cd')
})

//regex 
app.get(/a/, (req, res) => {
    res.send('regex expression valdation')
})

app.get(/.*fly$/, (req, res) => {
    res.send('regex expression valdation')
})
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});
