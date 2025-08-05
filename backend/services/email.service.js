const nodemailer = require('nodemailer');
require('dotenv').config();

const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.de',
  port: 465,
  secure: true,
  auth: {
    user: gmxUser,
    pass: gmxPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendWelcomeEmail(to, firstname) {
  const mailOptions = {
    from: 'info@yowayoli.com',
    to,
    subject: 'Feliratkozás megerősítése',
    text: `Kedves ${firstname}, sikeresen feliratkoztál a yowayoli.com hírlevelére!`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${to}:`, error);
    throw error;
  }
}

async function sendEmail(to, subject, message) {
  console.log('email.service started!');
  const mailOptions = {
    from: 'info@yowayoli.com',
    to: to,
    subject: subject,
    text: message
  };
  console.log('trying to send email for:', to);
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${to}:`, error);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendEmail,
  transporter
};

