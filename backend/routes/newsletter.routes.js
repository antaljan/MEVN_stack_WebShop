const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const { save } = require('../controllers/newsletter.controller');

// subscribe
router.post('/subscribe', newsletterController.subscribe);

// get subscribers
router.post('/subscribers', newsletterController.getSubscribers);

// unsubscribe
router.get('/unsubscribe/:email', newsletterController.unsubscribe);

// send
router.post('/send', newsletterController.send);

// send
router.post('/getsceduled', newsletterController.schednewsletters);

// save newsletter template in mongo
router.post('/save', save);

module.exports = router;