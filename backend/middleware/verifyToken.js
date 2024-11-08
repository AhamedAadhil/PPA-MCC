import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - no token provided",
      success: false,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token", success: false });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.status = decoded.status;

    if (req.status !== "ACTIVE") {
      return res.status(401).json({
        message: "Unauthorized - Your account is inactive",
        success: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};
