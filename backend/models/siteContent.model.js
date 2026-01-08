const { getDb } = require('../db/mongo');
const { ObjectId } = require('mongodb');

const COLLECTION = 'siteContent';

async function getSection(section, language) {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ section, language });
}

async function updateSection(section, language, data) {
  const db = getDb();
  return await db.collection(COLLECTION).updateOne(
    { section, language },
    { $set: data },
    { upsert: true }
  );
}

module.exports = {
  getSection,
  updateSection
};
