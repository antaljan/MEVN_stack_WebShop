const { client } = require('../db/mongo');

async function logger(req, res, next) {
  const logData = {
  ip: req.ip,
  method: req.method,
  url: req.originalUrl,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString()
};

  try {
    const db = client.db('yowayoli');
    const collection = db.collection('apiLogs');
    await collection.insertOne({ logData });
  } catch (err) {
    console.error('Logger error:', err);
  }

  next();
}

module.exports = logger;
