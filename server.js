const mongoose = require("mongoose");
const server = require("./app");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful"))
  .catch((e) => console.log("DB connection failed"));

server.listen(process.env.PORT, () => {
  console.log("listening on *:5000");
});
