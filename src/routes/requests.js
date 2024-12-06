const { requestRouter, userAuth, ConnectionRequest, User } = require("./index");

requestRouter.post(
    "/request/send/:status/:userId",
    userAuth,
    async (req, res, next) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.userId;
            const status = req.params.status;

            const toUser = await User.findById(toUserId);

            const ALLOWED_SEND_STATUS = ["interested", "ignored"];
            if (!ALLOWED_SEND_STATUS.includes(status)) {
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

module.exports = requestRouter;
