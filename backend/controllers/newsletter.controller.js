const newsletterModel = require('../models/newsletter.model');
const emailService = require('../services/email.service');

async function subscribe(req, res) {
  const { firstname, name, email } = req.body;
  try {
    const result = await newsletterModel.addSubscriber({ firstname, name, email });

    // Küldj üdvözlő emailt
    await emailService.sendWelcomeEmail(email, firstname);

    res.status(201).json({ ok: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('Feliratkozás hiba:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function getSubscribers(req, res) {
  try {
    const subscribers = await newsletterModel.getAllSubscribers();
    res.status(200).json({ ok: true, subscribers });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function unsubscribe(req, res) {
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ ok: false, message: 'Email address is required.' });
  }
  try {
    const result = await newsletterModel.deleteSubscriberByEmail(email);
    if (result.deletedCount === 1) {
      res.status(200).json({ ok: true, message: 'Unsubscribed successfully.' });
    } else {
      res.status(404).json({ ok: false, message: 'Email not found.' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Server error.', error: error.message });
  }
}

module.exports = {
  subscribe,
  getSubscribers,
  unsubscribe
};
