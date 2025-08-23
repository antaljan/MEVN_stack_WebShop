const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const { save } = require('../controllers/newsletter.controller');

// subscribe
router.post('/subscribe', newsletterController.subscribe);

// update subscriber
router.put('/subscriber', authenticateToken, newsletterController.updateOneSubscriber);

// get subscribers
router.post('/subscribers', authenticateToken, newsletterController.getSubscribers);

// unsubscribe
router.get('/unsubscribe/:email', newsletterController.unsubscribe);

// send
router.post('/send', authenticateToken, newsletterController.send);

// get all scheduled newsletters
router.post('/getsceduled', authenticateToken, newsletterController.schednewsletters);

// save newsletter template
router.post('/save', authenticateToken, save);

// get all newsletter templates
router.post('/gettemplates', authenticateToken, newsletterController.gettemplates);

// get one newsletter template
router.post('/getonetemplate', authenticateToken, newsletterController.getonetemplate);

// delete newsletter template
router.post('/deletetemplate', authenticateToken, newsletterController.deleteTemplate);

module.exports = router;