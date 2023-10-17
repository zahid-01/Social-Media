const {
  login,
  signUp,
  me,
  protect,
  silly,
} = require("../Controllers/authController");

const AuthRouter = require("express").Router();

AuthRouter.post("/signUp", signUp);
AuthRouter.post("/login", login);
AuthRouter.get("/silly", silly);

AuthRouter.use(protect);
AuthRouter.route("/me").get(me);

module.exports = AuthRouter;
