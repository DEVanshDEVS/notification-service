// src/services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


exports.sendEmail = async (to, message, subject = 'Notification') => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, // your verified sender or SMTP user
      to,
      subject,
      text: message,
    });
    return true;
  } catch (error) {
    console.error('Nodemailer error:', error);
    return false;
  }
};
