const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');

// subscribe
router.post('/subscribe', newsletterController.subscribe);

// get subscribers
router.post('/subscribers', newsletterController.getSubscribers);

// unsubscribe
router.get('/unsubscribe/:email', newsletterController.unsubscribe);

module.exports = router;