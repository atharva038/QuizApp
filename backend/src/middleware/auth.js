import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({message: "No token provided"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role || "user",
    };
    next();
  } catch (err) {
    return res.status(401).json({message: "Invalid token"});
  }
};
