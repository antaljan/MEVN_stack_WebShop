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
  const data = req.body;

  try {
    await updateSection(section, language, data);
    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
