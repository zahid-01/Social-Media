const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  userName: String,
  name: {
    type: String,
    required: [true, "Provide a name"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Provide a valid email"],
    required: [true, "Provide an email"],
    unique: [true, "Email already exists"],
  },
  password: String,
  bio: String,
  friends: [],
  posts: [],
  likedPosts: [],
  chatHistory: [
    {
      userId: { type: mongoose.Schema.ObjectId, ref: "users" },
      messages: [
        {
          sender: { type: mongoose.Schema.ObjectId, ref: "users" },
          message: String,
          timeStamp: { type: Date, default: Date.now() },
        },
      ],
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = async (password, credential) =>
  await bcrypt.compare(credential, password);

const User = new mongoose.model("users", userSchema);
module.exports = User;
