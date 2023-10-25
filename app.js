const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const AuthRouter = require("./Routes/authRouter");
const UserRouter = require("./Routes/userRoutes");
const errorController = require("./Controllers/errorController");

const {
  socketAuth,
  socketConnection,
} = require("./Controllers/socketController");
const PostRouter = require("./Routes/postRouter");
const FollowerRouter = require("./Routes/followerRouter");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
dotenv.config({ path: "./config.env" });

app.use("/api/v1/", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/userPost", PostRouter);
app.use("/api/v1/followers", FollowerRouter);

io.use(socketAuth);

io.on("connection", socketConnection);

app.use(errorController);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "Fail",
    message: `Cant find ${req.originalUrl} on this server`,
  });
});

module.exports = server;
