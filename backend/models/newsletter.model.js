// newsletter model
const { ObjectId } = require('mongodb');
const { client } = require('../db/mongo');
function getDb() { require('../db/mongo') };

let collection;

function init() {
  const db = client.db('yowayoli'); 
  collection = db.collection('aboliste');
  console.log('📬 Newsletter collection initialized');
}


function addSubscriber({ firstname, name, email }) {
  return collection.insertOne({ firstname, name, email });
}

function getAllSubscribers() {
  return collection.find({}).toArray();
}

function deleteSubscriberByEmail(email) {
  return collection.deleteOne({ email });
}

module.exports = {
  init,
  addSubscriber,
  getAllSubscribers,
  deleteSubscriberByEmail
};
