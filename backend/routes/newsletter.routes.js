const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const { save } = require('../controllers/newsletter.controller');

// subscribe
router.post('/subscribe', newsletterController.subscribe);

// update subscriber
router.put('/subscriber', newsletterController.updateOneSubscriber);

// get subscribers
router.post('/subscribers', newsletterController.getSubscribers);

// unsubscribe
router.get('/unsubscribe/:email', newsletterController.unsubscribe);

// send
router.post('/send', newsletterController.send);

// send
router.post('/getsceduled', newsletterController.schednewsletters);

// save newsletter template
router.post('/save', save);

// get all newsletter templates
router.post('/gettemplates', newsletterController.gettemplates);

// delete newsletter template
router.post('/deletetemplate', newsletterController.deleteTemplate);

module.exports = router;