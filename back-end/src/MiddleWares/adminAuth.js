import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token structure
    if (!decoded.email || !decoded.role) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token structure" });
    }

    // Check admin credentials
    if (decoded.email !== process.env.ADMIN_EMAIL || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized - invalid credentials",
        debug: {
          receivedEmail: decoded.email,
          expectedEmail: process.env.ADMIN_EMAIL,
          receivedRole: decoded.role,
        },
      });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};

export default adminAuth;
