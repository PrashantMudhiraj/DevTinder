const adminAuth = (req, res, next) => {
    console.log("Admin Auth check");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("unautorized");
    } else {
        next();
    }
};

const userAuth = (req, res, next) => {
    console.log("User Auth check");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("unautorized");
    } else {
        next();
    }
};

module.exports = { adminAuth, userAuth };
