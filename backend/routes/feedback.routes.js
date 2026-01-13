const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback.controller');
const authenticateToken = require('../middleware/auth');

// CREATE (admin)
router.post('/new', authenticateToken, feedbackController.createFeedback);

// READ ALL (public)
router.get('/', feedbackController.getAllFeedbacks);

// READ ONE (public)
router.get('/:id', feedbackController.getFeedbackById);

// UPDATE (admin)
router.put('/:id', authenticateToken, feedbackController.updateFeedback);

// DELETE (admin)
router.delete('/:id', authenticateToken, feedbackController.deleteFeedback);

module.exports = router;
