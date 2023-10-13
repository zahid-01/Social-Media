const jwt = require("jsonwebtoken");
const catchAsync = require("../Utilities/cathAsync");
const User = require("../Model/userModel");
const AppError = require("../Utilities/appErrors");
const { promisify } = require("util");

exports.socketConnection = (socket) => {
  console.log("a user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("my_message", msg);
  });
};

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
