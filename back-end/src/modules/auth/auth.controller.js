import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { Admin } from "../../../DB/models/Admin.schema.js";

// Route for admin login
const adminLogin = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  // Trim and compare credentials
  if (
    email.trim() !== process.env.ADMIN_EMAIL ||
    password.trim() !== process.env.ADMIN_PASSWORD
  ) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Generate token
  const token = jwt.sign(
    {
      email: process.env.ADMIN_EMAIL,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  // Send success response
  res.status(200).json({
    success: true,
    token,
    message: "Login successful",
  });
});

const changeUserPassword = catchError(async (req, res, next) => {
  let admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return next(new AppError("Email or Password incorrect ..", 404));
  let match = bcrypt.compareSync(req.body.oldPassword, admin.password);
  if (!match) return next(new AppError("Email or Password incorrect ..", 404));

  await Admin.findOneAndUpdate(
    { email: req.body.email },
    { password: req.body.newPassword, passwordChangedAt: Date.now() }
  );
  jwt.sign(
    { userId: admin._id, name: admin.name },
    process.env.SECRET_KEY,
    (err, token) => {
      res.status(200).json({ message: "Login Successfully  ..", token, admin });
    }
  );
});

export { adminLogin, changeUserPassword };
