const express = require('express');
const router = express.Router();
const emailService = require('../services/email.service');

router.post('/send', async (req, res) => {
console.log('Request body:', req.body);
    const { to, subject, message } = req.body;
    try {
        await emailService.sendEmail(to, subject, message);
        res.status(200).send('E-Mail gesendet!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;