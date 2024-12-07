const {
    requestRouter,
    userAuth,
    ConnectionRequest,
    User,
    isValidStatus,
} = require("./index");

requestRouter.post(
    "/request/send/:status/:userId",
    userAuth,
    async (req, res, next) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.userId;
            const status = req.params.status;

            const toUser = await User.findById(toUserId);

            // const ALLOWED_SEND_STATUS = ["interested", "ignored"];
            if (!isValidStatus("send", status)) {
                return res
                    .status(400)
                    .send(`${status} status request not allowed`);
            }

            if (!toUser) {
                return res.status(404).send("User not found!");
            }

            const existingConnectionCheck = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (existingConnectionCheck) {
                return res.status(400).send("Connection request already exist");
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save();
            res.json({
                message: ` ${req.user.firstName} your request processed for ${status} to ${toUser.firstName}`,
                data,
            });
        } catch (error) {
            res.status(400).send("ERROR : " + error.message);
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggerInUser = req.user;
            const { status, requestId } = req.params;
            // const ALLOWED_REVIEW_STATUS = ["accepted", "rejected"];
            if (!isValidStatus("review", status)) {
                return res.status(400).send("Status not allowed");
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggerInUser._id,
                status: "interested",
            });
            if (!connectionRequest) {
                return res
                    .status(404)
                    .json({ messge: "No connection requests" });
            }
            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.json({ message: `Connection request ${status}`, data: data });
        } catch (error) {
            console.log(error);
            res.status(400).send("Something went wrong :" + error.message);
        }
    }
);

module.exports = requestRouter;
