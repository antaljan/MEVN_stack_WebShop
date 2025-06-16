/**
 * Express application for sending emails using Nodemailer and GMX SMTP service.
 * 
 * @module app
 */

const express = require('express');
const nodemailer = require('nodemailer');

/**
 * POST /send-email
 * Endpoint to send an email using the provided email, subject, and message in the request body.
 *
 * @name POST/send-email
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object
 * @param {string} req.body.email - Recipient's email address
 * @param {string} req.body.subject - Subject of the email
 * @param {string} req.body.message - Body text of the email
 * @param {Object} res - Express response object
 * @returns {string} Success or error message
 */

/**
 * Starts the Express server on port 4200.
 * Logs a message to the console when the server is running.
 */

const app = express();
app.use(express.json());

// Im Backend (Node/Express)
const cors = require('cors');
app.use(cors());


    const transporter = nodemailer.createTransport({
        host: 'mail.gmx.net',
        port: 587,
        secure: false, // true für Port 465, false für 587
        auth: {
            user: 'asd0125@gmx.de', // A te GMX e-mail címed
            pass: 'SgdScrum25' // A te GMX jelszavad
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    module.exports = transporter;

app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        await transporter.sendMail({
            from: 'asd0125@gmx.de',
            to: 'antali.gyongyi@gmail.com',
            subject: 'Üzenet a Honlapról!',
            text: 'Név: '+subject+', email:'+email+', üzenet:'+message,
        });
        res.status(200).send('E-Mail gesendet!');
    } catch (error) {
        console.error(error); // Fehler in der Konsole anzeigen
        res.status(500).send(error.message); // Fehler an Client zurückgeben
    }
});

// Indítsuk el a szervert

app.listen(3000, () => console.log('Server fut a 3000-es porton'));
