const { userRouter, userAuth, ConnectionRequest } = require("./index");

const UserSafeData = "firstName lastName skills about age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", UserSafeData);

        res.json({
            message: "Connection request fetched!",
            data: connectionRequests,
        });
    } catch (error) {
        req.statusCode(500).send("Something went wrong : ", error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", UserSafeData)
            .populate("toUserId", UserSafeData);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId
        });
        res.json({ data });
    } catch (error) {
        req.statusCode(500).send("Something went wrong : ", error.message);
    }
});

module.exports = userRouter;
