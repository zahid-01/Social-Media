const Posts = require("../Model/postModel");
const AppError = require("../Utilities/appErrors");
const catchAsync = require("../Utilities/cathAsync");

exports.createPost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const postText = req.body.postText;
  const postImage = req.body.postImage;

  const newPost = await Posts.create({ userId, postText, postImage });

  res.status(200).json({
    status: "Success",
    newPost,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  if (!req.body.postText)
    return next(new AppError("422", "Provide a post text"));

  const post = await Posts.findById(postId);

  const postUserId = post.userId.toHexString();
  const reqUserId = req.user.id;

  if (postUserId != reqUserId)
    return next(new AppError(400, "Not your post buddy, back off"));

  post.postText = req.body.postText;

  const updatedPost = await post.save();

  res.status(200).json({
    status: "Success",
    updatedPost,
  });
});

exports.getMyPosts = catchAsync(async (req, res) => {
  const posts = await Posts.find({ userId: req.user.id });

  res.status(200).json({
    status: "Success",
    posts,
  });
});

exports.deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  await Posts.findByIdAndDelete(postId);

  res.status(200).json({
    status: "Success",
  });
});
