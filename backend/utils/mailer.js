const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'mail.gmx.net', // vagy más SMTP szerver
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMX_USER,
    pass: process.env.GMX_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = transporter;
