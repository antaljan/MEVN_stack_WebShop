// newsletter model
const { ObjectId } = require('mongodb');

let collection;

function init(db) {
  collection = db.collection('aboliste');
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
