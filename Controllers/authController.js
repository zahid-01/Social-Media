const jwt = require("jsonwebtoken");

const User = require("../Model/userModel");
const AppError = require("../Utilities/appErrors");
const catchAsync = require("../Utilities/cathAsync");

const createSendToken = (req, res) => {
  const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN,
  };

  const token = jwt.sign(
    { id: req.user.id },
    process.env.JWT_SECRET,
    jwtOptions
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "Success",
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new AppError(401, "Enter the required fields"));

  const newUser = await User.create({ name, email, password });

  req.user = newUser;

  createSendToken(req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(401, "Enter your credentials"));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError(401, "No user found"));

  const isValid = await user.checkPassword(user.password, password);
  if (!isValid) return next(new AppError(400, "Invalid credentials"));

  req.user = user;

  createSendToken(req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AppError(401, "Not Logged in!"));

  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(id);
  if (!user) return next(new AppError(401, "Not Logged in!"));

  req.user = user;
  next();
});

exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "Success",
    user: req.user,
  });
});

exports.silly = (req, res, next) => {
  // res.json({
  //   status: "Success",
  // });
  next();
};
