const newsletterModel = require('../models/newsletter.model');
const emailService = require('../services/email.service');

function fillTemplate(content, data) {
  return content
    .replace(/{{firstname}}/g, data.firstname)
    .replace(/{{email}}/g, data.email);
}

// subscribe for newsletter --> save subscriber in mongodb
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

// get all subscribers from mongodb
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

// get all scheduled newsletters
async function schednewsletters(req, res) {
  console.log('Frontend try to get all scheduled newsletters.');
  try {
    const scheduledNewsletters = await newsletterModel.getAllNewsletters();
    console.log('successfull',);
    res.status(200).json({ ok: true, scheduledNewsletters });
  } catch (error) {
    console.log('error:',error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

// unsubscribe from newsletter --> delete subscriber from mongodb
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

// send newsletter selected subscribers with timing
async function send(req, res) {
  console.log('Frontend try to scedule newsletter sending.');
  const { subject, rawcontent, subscribers, sendDate, sent } = req.body;

  if (!subject) {
    console.log('subject is required.');
    return res.status(400).json({ ok: false, error: 'subject is required.' });
  }
  if (!rawcontent) {
    console.log('rawcontent is required.');
    return res.status(400).json({ ok: false, error: 'rawcontent is required.' });
  }
  if (!subscribers) {
    console.log('subscribers are required.');
    return res.status(400).json({ ok: false, error: 'subscribers are required.' });
  }
  if (!sendDate) {
    console.log('sendDate is required.');
    return res.status(400).json({ ok: false, error: 'sendDate is required.' });
  }
 
  try {
    await newsletterModel.saveScheduledNewsletter({ subject, rawcontent, subscribers, sendDate, sent: false });
    console.log('Newsletter scheduled successfully.');
    res.status(200).json({ ok: true, message: 'Newsletter scheduled successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

module.exports = {
  subscribe,
  fillTemplate,
  getSubscribers,
  unsubscribe,
  send,
  schednewsletters
};
