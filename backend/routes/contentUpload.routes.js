const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'content-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Admin-only image upload
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'Image uploaded',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`   // <-- EZ A HELYES
  });
});

module.exports = router;
