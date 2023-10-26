const FollowerRouter = require("express").Router();
const { protect } = require("../Controllers/authController");
const {
  addFriend,
  acceptRequest,
  removeFriend,
} = require("../Controllers/followersController");

FollowerRouter.use(protect);
//Remove follower
FollowerRouter.delete("/:id", removeFriend);
//Send request
FollowerRouter.post("/request", addFriend);
//Accept request
FollowerRouter.post("/", acceptRequest);

module.exports = FollowerRouter;
