const newsletterModel = require('../models/newsletter.model');
const emailService = require('../services/email.service');

async function subscribe(req, res) {
  const { firstname, name, email } = req.body;
  try {
    const result = await newsletterModel.addSubscriber({ firstname, name, email });
    // greating mail
    await emailService.sendWelcomeEmail(email, firstname);
    console.log('successfull');
    res.status(201).json({ ok: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function getSubscribers(req, res) {
  console.log('Frontend try to get all subscribers.');
  try {
    const subscribers = await newsletterModel.getAllSubscribers();
    console.log('successfull',);
    res.status(200).json({ ok: true, subscribers });
  } catch (error) {
    console.log('error:',error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function unsubscribe(req, res) {
  const email = req.params.email;
  console.log('unsubscribe started for:', email);
  if (!email) {
    console.log('Email address is required');
    return res.status(400).json({ ok: false, message: 'Email address is required.' });
  }
  try {
    const result = await newsletterModel.deleteSubscriberByEmail(email);
    if (result.deletedCount === 1) {
      console.log('Unsubscribed successfully.');
      res.status(200).json({ ok: true, message: 'Unsubscribed successfully.' });
    } else {
      console.log('error: email not found');
      res.status(404).json({ ok: false, message: 'Email not found.' });
    }
  } catch (error) {
    console.log('error:',error);
    res.status(500).json({ ok: false, message: 'Server error.', error: error.message });
  }
}

module.exports = {
  subscribe,
  getSubscribers,
  unsubscribe
};
