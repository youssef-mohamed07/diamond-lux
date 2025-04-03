import { catchError } from "../../MiddleWares/CatchError.js";
import jwt from "jsonwebtoken";

const getUserToken = catchError(async (req, res) => {
  try {
    // Check if token already exists in cookies
    const existingToken = req.cookies.token;

    if (existingToken) {
      return res.status(200).json({
        success: true,
        message: "Using existing token",
      });
    }

    // Generate a new JWT token
    const token = jwt.sign({ timestamp: Date.now() }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Set token in cookie with effectively infinite lifespan
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years (a very long duration)
    });

    res.status(200).json({
      success: true,
      message: "New token generated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export { getUserToken };
