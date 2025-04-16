import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_USER,
    pass: process.env.TRANSPORTER_PASS,
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!to) throw new Error("Recipient email is missing");

    const mailOptions = {
      from: process.env.TRANSPORTER_USER,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Email Sending Failed:", error);
    throw new Error("Failed to send email");
  }
};
