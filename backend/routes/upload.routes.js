const express = require('express');
const router = express.Router();
const { uploadMiddleware } = require('../middleware/upload');

router.post('/', uploadMiddleware, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }
    res.status(200).json({
        message: 'Datei erfolgreich hochgeladen',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });
});

module.exports = router;