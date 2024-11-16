const express = require("express");

const app = express();


//Below route will not allow other routes why because each and every route will match "/" path
//code is executed in sequence 
app.get("/dashboard", (req, res) => {
    res.send("Hello this is dashboard");
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

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});
