const { login } = require("../Controllers/authController");

const AuthRouter = require("express").Router();

AuthRouter.post("/", login);

module.exports = AuthRouter;
