const { client } = require('../db/mongo');
const geoip = require('geoip-lite');

async function logger(req, res, next) {
  try {
    // Valós IP meghatározása reverse proxy mögött is
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.connection.remoteAddress ||
      req.ip;

    // GeoIP lookup (offline, gyors)
    const geo = geoip.lookup(ip);

    // Lapos, aggregáció-barát log dokumentum
    const logEntry = {
      ip,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
      country: geo?.country || null,
      city: geo?.city || null
    };

    // Mentés MongoDB-be
    const db = client.db('yowayoli');
    const collection = db.collection('apiLogs');

    await collection.insertOne(logEntry);

  } catch (err) {
    console.error('Logger error:', err);
  }

  next();
}

module.exports = logger;
