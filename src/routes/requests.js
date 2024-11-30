const { requestRouter, userAuth } = require("./index");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res, next) => {
    try {
        const user = req.user;
        res.send(`${user.firstName} sent a connection request`);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = requestRouter;
