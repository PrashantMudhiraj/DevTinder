const {
    profileRouter,
    userAuth,
    validateEditRequestData,
    validatePasswordUpdate,
    encryptPassword,
} = require("./index");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        console.log(req.user);
        res.send(req.user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestToUpdateData = req.body;

        const isEditAllowed = validateEditRequestData(requestToUpdateData);

        if (!isEditAllowed) throw new Error("Edit not allowed!");
        Object.keys(requestToUpdateData).forEach((key) => {
            loggedInUser[key] = requestToUpdateData[key];
        });

        // console.log(loggedInUser)
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

//update password
//checks
//1. user should login
//2. Get new password from req.body
//3. In Patch API get current password and new password
//4. compare current password and patch api password
//5. if validate is success compare existing password with new password else throw error
//6. if validate is success update new password.
//7. optional - we can add a validation like user able to update password 2 times a day. need to add one field (noofTimesUpdated).

profileRouter.patch("/profile/UpdatePassword", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const isUpdateAllowed = await validatePasswordUpdate(req);
        if (!isUpdateAllowed)
            throw new Error("Updated failed, Please retry.");
        const passwordHash = await encryptPassword(req.body.newPassword)
        loggedInUser.password = passwordHash
        await loggedInUser.save()
        res.send("Password Updated");
    } catch (error) {
        console.log(error.message);
        res.status(400).send("Update Password failed : " + error.message);
    }
});

module.exports = profileRouter;
