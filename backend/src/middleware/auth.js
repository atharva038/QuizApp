import jwt from "jsonwebtoken";

// Middleware to authenticate requests
export const auth = (req, res, next) => {
  // 1️⃣ Read token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({message: "No token provided"});
  }

  try {
    // 2️⃣ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info to req for downstream routes
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    // 4️⃣ Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({message: "Token expired"});
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({message: "Invalid token"});
    }
    return res.status(401).json({message: "Authentication failed"});
  }
};
