import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// function to generate code for verification
const generateVerificationToken = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1_000_000).toString().padStart(6, "0");
};

// function to generate token
const generateToken = async (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

// function to set cookies
const setCookies = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

///////////////////
// Main Controllers
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check if user exist
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(new AppError("User already exists", 409));
  }

  // generate verification token
  const verificationToken = generateVerificationToken();

  // create a new user
  const newUser = await User.create({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 5 * 60 * 60 * 1000,
  });

  // make user authenticated
  // 1) generate tokens
  const token = await generateToken(newUser._id);
  // 2) set cookies
  setCookies(res, token);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {});

export const logout = catchAsync(async (req, res, next) => {});
