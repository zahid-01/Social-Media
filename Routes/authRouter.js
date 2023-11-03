const {
  login,
  signUp,
  me,
  protect,
  isLoggedIn,
  logout,
} = require("../Controllers/authController");

const AuthRouter = require("express").Router();

AuthRouter.post("/signUp", signUp);
AuthRouter.post("/login", login);
AuthRouter.get("/isLoggedIn", isLoggedIn);
AuthRouter.post("/logout", logout);

AuthRouter.use(protect);
AuthRouter.route("/me").get(me);

module.exports = AuthRouter;
