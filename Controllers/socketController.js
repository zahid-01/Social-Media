const jwt = require("jsonwebtoken");
const catchAsync = require("../Utilities/cathAsync");
const User = require("../Model/userModel");
const AppError = require("../Utilities/appErrors");
const { promisify } = require("util");

const saveMessageToUsers = async (recepient, senderId, message) => {
  const to = await User.findOne({ email: recepient });
  const from = await User.findById(senderId);

  if (!to) return new AppError(400, "No user exists");

  const chatHistory = to.chatHistory.find((chat) =>
    chat.userId.equals(senderId)
  );
  const chatHistoryRecepient = from.chatHistory.find((chat) =>
    chat.userId.equals(recepient)
  );

  if (chatHistory) {
    chatHistory.messages.push({ sender: senderId, message });
  } else {
    to.chatHistory.push({
      userId: senderId,
      messages: [{ sender: senderId, message }],
    });
  }

  if (chatHistoryRecepient) {
    chatHistoryRecepient.messages.push({ sender: senderId, message });
  } else {
    from.chatHistory.push({
      userId: to.id,
      messages: [
        {
          sender: senderId,
          message,
        },
      ],
    });
  }

  to.save();
  from.save();
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

let connectedUsers = {};

exports.socketConnection = (socket) => {
  console.log("a user connected ", socket.id);

  if (!connectedUsers[socket.user.email])
    connectedUsers[socket.user.email] = socket;

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });

  socket.on("private_message", async (msg, friend) => {
    const id = socket.user.id;
    if (connectedUsers[friend]) {
      await saveMessageToUsers(friend, id, msg);
      connectedUsers[friend].emit("privateMessage", msg);
    }
  });
};
