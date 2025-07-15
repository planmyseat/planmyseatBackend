import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log("Email:", process.env.SMTP_USER);
console.log("Password:", process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"PlanMySeat" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
