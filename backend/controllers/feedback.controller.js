const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');
const sanitizeHtml = require('sanitize-html');

// HTML sanitization (ugyanaz, mint a blognál)
const sanitizeContent = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'u',
      'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4',
      'a'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      })
    }
  });
};

// CREATE
const createFeedback = async (req, res) => {
  try {
    const { name, content, language, rating, status, source } = req.body;

    if (!name || !content || !language || !rating || !status) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const sanitizedContent = sanitizeContent(content);

    const result = await getDb().collection('feedbacks').insertOne({
      name,
      content: sanitizedContent,
      language,
      rating: Number(rating),
      status,
      source: source || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ success: true, insertedId: result.insertedId });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL (szűrés nyelvre + státuszra)
const getAllFeedbacks = async (req, res) => {
  try {
    const { language, status } = req.query;
    const filter = {};

    if (language) filter.language = language;
    if (status) filter.status = status;

    const feedbacks = await getDb()
      .collection('feedbacks')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(feedbacks);

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET BY ID
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await getDb()
      .collection('feedbacks')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json(feedback);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE
const updateFeedback = async (req, res) => {
  try {
    const { name, content, language, rating, status, source } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (language !== undefined) updateData.language = language;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (status !== undefined) updateData.status = status;
    if (source !== undefined) updateData.source = source;

    if (content !== undefined) {
      updateData.content = sanitizeContent(content);
    }

    updateData.updatedAt = new Date();

    const result = await getDb().collection('feedbacks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE
const deleteFeedback = async (req, res) => {
  try {
    const result = await getDb().collection('feedbacks').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
};
