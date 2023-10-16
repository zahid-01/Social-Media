const jwt = require("jsonwebtoken");
const catchAsync = require("../Utilities/cathAsync");
const User = require("../Model/userModel");
const AppError = require("../Utilities/appErrors");
const { promisify } = require("util");

exports.socketAuth = catchAsync(async (socket, next) => {
  const cookie = socket.handshake.auth.token;
  if (!cookie) {
    console.log("Login to chat");
    return next(new AppError(401, "Login to chat!"));
  }

  const { id } = await promisify(jwt.verify)(cookie, process.env.JWT_SECRET);
  const user = await User.findById(id);

  if (!user) {
    console.log("No user found");
    return next(new AppError(401, "No user found"));
  }

  socket.user = user;
  next();
});

let connectedUsers = {};

exports.socketConnection = (socket) => {
  console.log("a user connected ", socket.id);

  if (!connectedUsers[socket.user.email])
    connectedUsers[socket.user.email] = socket;

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });

  socket.on("private_message", (msg, friend) => {
    if (connectedUsers[friend])
      connectedUsers[friend].emit("privateMessage", msg);
  });
};
