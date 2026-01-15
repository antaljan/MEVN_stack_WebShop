const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');

// GET – list all uploaded images
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Cannot read upload directory' });

    const images = files.map(f => ({
      filename: f,
      url: `/uploads/${f}`
    }));

    res.json(images);
  });
});

// DELETE – delete a specific image
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  // Security: prevent path traversal
  if (!filePath.startsWith(uploadDir)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  fs.unlink(filePath, err => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.json({ success: true });
  });
});

module.exports = router;
