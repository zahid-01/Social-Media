const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const AuthRouter = require("./Routes/authRouter");
const { login } = require("./Controllers/authController");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use("/", AuthRouter);

io.use((socket, next) => {
  const isValid = login();
  if (!isValid) socket.disconnect(true);

  return next();
});

io.on("connection", (socket) => {
  console.log("a user connected ", socket.id);
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
  socket.on("chat", (msg) => {
    socket.broadcast.emit("my message", msg);
  });
  // io.emit("chat message", socket.id);
});

module.exports = server;
