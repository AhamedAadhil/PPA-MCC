import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, role, status) => {
  const token = jwt.sign({ userId, role, status }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //csrf attack prevention
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
