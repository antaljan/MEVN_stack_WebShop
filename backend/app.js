/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 */

const express = require('express');
const nodemailer = require('nodemailer');

// Create an Express application
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Nodemailer configuration for GMX SMTP service
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.net',
    port: 587,
    secure: false, // true für Port 465, false für 587
    auth: {
        user: 'asd0125@gmx.de', // GMX e-mail accont
        pass: 'SgdScrum25' // Passwort für das GMX-Konto
    },
    tls: {
        rejectUnauthorized: false
    }
});
module.exports = transporter;

/**
 * POST /send-email
 * Endpoint to send an email using the provided email, subject, and message in the request body.
 */

app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        await transporter.sendMail({
            from: 'asd0125@gmx.de', // sender E-Mail, !!same like defined in tansporter!!
            to: 'antalijanos76@gmail.com',
            subject: 'Üzenet a Honlapról!',
            text: 'Név: '+subject+', email:'+email+', üzenet:'+message,
        });
        res.status(200).send('E-Mail gesendet!');
    } catch (error) {
        console.error(error); // Failure loggen
        res.status(500).send(error.message); // give back the error message for Frontend
    }
});

// Start of the server
app.listen(3000, () => console.log('Server fut a 3000-es porton'));
