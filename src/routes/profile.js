const { profileRouter, userAuth } = require("./index");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        console.log(req.user);
        res.send(req.user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = profileRouter;
