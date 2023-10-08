const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
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

server.listen(5000, () => {
  console.log("listening on *:5000");
});
