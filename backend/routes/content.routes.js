const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getSection, updateSection } = require('../models/siteContent.model');

// GET content for a section + language
router.get('/:section/:language', async (req, res) => {
  const { section, language } = req.params;

  try {
    const content = await getSection(section, language);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE content (admin only)
router.put('/:section/:language', authenticateToken, async (req, res) => {
  const { section, language } = req.params;
  const body = req.body;

  // Remove fields that must not be updated
  const { _id, section: bodySection, language: bodyLanguage, ...data } = body;

  // Normalize image path
  if (data.image) {
    data.image = data.image.replace("https://antaligyongyi.hu", "");
    data.image = data.image.replace("/api", ""); // fontos!
    if (data.image.includes("?")) {
      data.image = data.image.split("?")[0];
    }
  }

  try {
    await updateSection(section, language, data);
    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
