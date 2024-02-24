import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  registerBodyValidation,
  loginBodyValidation,
} from "../validators/auth.js";

export const test = (req, res) => {
  res.status(200).json({
    success: true,
    message: "auth route has been successfully established.",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { error } = registerBodyValidation({ name, email, password });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser)
      return res
        .status(409)
        .json({ success: false, message: `User ${email} already exists` });

    const salt = Number(process.env.SALT);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: `The user account for ${email} has been created.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginBodyValidation({ email, password });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser)
      return res.status(404).json({
        success: false,
        message: `The user with the email ${email} does not exist.`,
      });
    const isCorrect = bcrypt.compareSync(
      req.body.password,
      isExistingUser.password
    );
    if (!isCorrect)
      return res
        .status(401)
        .json({ success: false, message: "Username or Password incorrect!" });
    const token = jwt.sign({ _id: isExistingUser._id }, process.env.JWT_SECRET);
    const { password: isExistingUserPassword, ...info } = isExistingUser._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // if your site is served over HTTPS
      })
      .status(200)
      .json({ success: true, message: "Login successfully", info });
  } catch (error) {}
};

export const logout = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "User logged out!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};
