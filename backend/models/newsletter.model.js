// newsletter model
const { ObjectId } = require('mongodb');
const { client } = require('../db/mongo');
const { getDb } = require('../db/mongo');

let collection;

function init() {
  const db = client.db('yowayoli'); 
  collection = db.collection('aboliste');
  console.log('📬 Newsletter collection initialized');
}


function addSubscriber({ firstname, name, email }) {
  return collection.insertOne({ firstname, name, email, group:"ujjonc" });
}

function deleteSubscriberByEmail(email) {
  return collection.deleteOne({ email });
}

async function saveNewsletter(newsletterData) {
  const db = getDb();
  const collection = db.collection('newsletters');

  const result = await collection.insertOne({
    subject: newsletterData.subject,
    rawcontent: newsletterData.rawcontent,
    sendDate: newsletterData.sendDate,
    createdAt: new Date()
  });
  return result;
}

async function getNewsletter() {
  const db = getDb();
  return await db.collection('newsletters').find({}).toArray();
};


module.exports = {
  init,
  addSubscriber,
  deleteSubscriberByEmail,
  saveNewsletter,
  getNewsletter,
  // save sceduled newsletter
  async saveScheduledNewsletter({ subject, rawcontent, subscribers, sendDate, sent = false }) {
    const result = await getDb().collection('schedulednewsletters').insertOne({
      subject,
      rawcontent,
      subscribers,
      sendDate: new Date(sendDate),
      sent
    });
    return result.insertedId;
  },

  // get sceduled newsletters
  async getDueNewsletters(currentTime) {
    const db = getDb();
    return await db.collection('schedulednewsletters')
      .find({
        sendDate: { $lte: currentTime },
        sent: false
      })
      .toArray();
  },

  // get all sceduled newsletters
  async getAllNewsletters() {
    const db = getDb();
    return await db.collection('schedulednewsletters').find({}).toArray();
  },

  // mark newsletter like sent
  async markAsSent(newsletterId) {
    const db = getDb();
    const { ObjectId } = require('mongodb');
    return await db.collection('schedulednewsletters').updateOne(
      { _id: new ObjectId(newsletterId) },
      { $set: { sent: true } }
    );
  },

  // get all subscribers
  async getAllSubscribers() {
    const db = getDb();
    return await db.collection('aboliste').find({}).toArray();
  }
};

