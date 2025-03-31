const { userRouter, userAuth, ConnectionRequest, User } = require("./index");

const UserSafeData = "firstName lastName skills about age gender photoUrl ";

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
        res.status(500).send("Something went wrong : " + error.message);
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
            return row.fromUserId;
        });
        res.json({ data });
    } catch (error) {
        res.status(500).send("Something went wrong : " + error.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        });

        const hideConnectionFromUser = new Set();

        connections.forEach((req) => {
            hideConnectionFromUser.add(req.fromUserId.toString());
            hideConnectionFromUser.add(req.toUserId.toString());
        });

        const feed = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hideConnectionFromUser),
                    },
                },
                {
                    _id: {
                        $ne: loggedInUser._id,
                    },
                },
            ],
        })
            .select(UserSafeData)
            .skip(skip)
            .limit(limit);

        // const feed = await User.find({
        //     _id: {
        //         $nin: Array.from(hideConnectionFromUser),
        //     },
        // })

        res.json({ feed });
    } catch (error) {
        res.status(500).send("Something went wrong : " + error.message);
    }
});
module.exports = userRouter;
