const errorHandler = (err, req, res, next) => {
    console.log("error handler");
    if (err) {
        res.status(500).send("something went wrong : " + err.message);
    }
};

module.exports = { errorHandler };
