const FollowerRouter = require("express").Router();
const { protect } = require("../Controllers/authController");
const { addFriend } = require("../Controllers/followersController");

FollowerRouter.use(protect);
FollowerRouter.route("/").post(addFriend);

module.exports = FollowerRouter;
