import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res
      .status(403)
      .json({ success: false, message: "You are not authenticated! " });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payload._id);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Access Denied: Invalid token" });
  }
};

export const checkIsAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: You are not a Admin" });
  next();
};
