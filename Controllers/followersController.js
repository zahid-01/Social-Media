const User = require("../Model/userModel");
const AppError = require("../Utilities/appErrors");
const catchAsync = require("../Utilities/cathAsync");

exports.addFriend = catchAsync(async (req, res, next) => {
  const { friendId } = req.body;
  const user = await User.findById(friendId);

  if (!user) return next(new AppError(401, "The user does not exist"));

  const sent = req.user.sentRequests.find((id) => id.equals(friendId));

  if (sent) {
    return next(new AppError(401, "Request already sent"));
  }

  if (!user.blockedList.includes(req.user.id)) {
    user.requests.push(req.user.id);
    req.user.sentRequests.push(friendId);
  } else return next(new AppError(401, "User blocked you"));

  req.user.save();
  user.save();

  res.status(200).json({
    status: "Success",
    message: "Friend request successfully sent",
  });
});
