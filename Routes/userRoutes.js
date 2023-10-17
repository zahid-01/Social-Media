const { protect } = require("../Controllers/authController");
const { getUserChats } = require("../Controllers/userController");

const UserRouter = require("express").Router();

UserRouter.use(protect);
UserRouter.route("/chats").get(getUserChats);

module.exports = UserRouter;
