const { login, signUp, me, protect } = require("../Controllers/authController");

const AuthRouter = require("express").Router();

AuthRouter.post("/signUp", signUp);
AuthRouter.post("/login", login);

AuthRouter.use(protect);
AuthRouter.route("/users").get(me);

module.exports = AuthRouter;
