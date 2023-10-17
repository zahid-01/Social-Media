const User = require("../Model/userModel");
const catchAsync = require("../Utilities/cathAsync");

exports.getUserChats = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const chats = await User.findById(id, { chatHistory: 1 });

  res.status(200).json({
    status: "Success",
    chats,
  });
});
