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

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const sender = await User.findById(req.body.id);
  const user = req.user;

  if (!sender) return next(new AppError(401, "User no longer exists"));

  //Get the id of friend to be added and update requests array
  let addFriend;
  const updatedRequests = user.requests.filter((request) => {
    if (request.id === req.body.id) addFriend = request.id;
    if (request.id != req.body.id) return request.id;
  });

  //Update Friends array of both users
  req.user.friends.push(addFriend);
  sender.friends.push(user);

  //Update sender sent requests array
  sender.sentRequests = sender.sentRequests.filter(
    (request) => request.id != user.id
  );

  //send notification to sender
  sender.notifications.push(
    `${user.name} accepted your follow request. ${new Date(
      Date.now()
    ).toLocaleString()}`
  );

  user.save();
  sender.save();

  res.status(200).json({
    status: "Success",
    message: "Friend added",
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const friend = await User.findById(id);
  if (!friend) return next(new AppError(400, "No users with the id exists"));

  //delete the friend from friend-list of both users
  user.friends = user.friends.filter((friend) => friend != id);
  friend.friends = friend.friends.filter((friend) => friend != user.id);

  //Save the changes
  user.save();
  friend.save();

  res.status(200).json({
    status: "Success",
    message: "Friend removed successfully",
  });
});
