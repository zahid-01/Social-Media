const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// const AuthRouter = require("./Routes/authRouter");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

app.post("/", (req, res) => {
  let isValid = false;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(403).json({
        status: "Fail",
        message: "Enter your credentials",
      });
    }
  } catch (e) {
    console.log(e);
  }

  isValid = true;
  io.use((socket, next) => {
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
  res.status(200).json({ status: "Success" });
});

module.exports = server;
