const { Schema, model, Types } = require("mongoose");

const connectionRequestSchema = new Schema(
    {
        fromUserId: {
            type: Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is not valid status",
            },
        },
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
        throw new Error("You cannot send request to yourself");
    next()
});

const ConnectionRequestModel = model(
    "connectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;
