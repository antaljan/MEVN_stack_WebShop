const geoip = require('geoip-lite');
const { sendEmail } = require('../services/email.service');

// Cache, hogy ne küldjön 100 emailt ugyanarra az IP-re
const alertCache = new Map();
const ALERT_TIMEOUT = 60 * 60 * 1000; // 1 óra

const suspiciousPaths = [
  '/.env',
  '/.git',
  '/phpunit',
  '/vendor',
  '/wp-admin',
  '/wp-login',
  '/swagger',
  '/eval-stdin.php'
];

module.exports = function botAlert(req, res, next) {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.connection.remoteAddress ||
      req.ip;

    const url = req.originalUrl;

    // Ha nem gyanús URL → tovább
    if (!suspiciousPaths.some(p => url.includes(p))) {
      return next();
    }

    // Ha már küldtünk riasztást erre az IP-re az elmúlt 1 órában → ne küldjünk újra
    const lastAlert = alertCache.get(ip);
    if (lastAlert && Date.now() - lastAlert < ALERT_TIMEOUT) {
      return next();
    }

    // GeoIP lookup
    const geo = geoip.lookup(ip);

    // Email tartalom
    const subject = `⚠️ Gyanús bot aktivitás észlelve: ${ip}`;
    const message = `
Gyanús bot aktivitást észleltem a szerveren.

IP cím: ${ip}
Ország: ${geo?.country || 'ismeretlen'}
Város: ${geo?.city || 'ismeretlen'}
URL: ${url}
User-Agent: ${req.headers['user-agent']}
Időpont: ${new Date().toISOString()}

Ez valószínűleg automata sebezhetőség-kereső bot.
    `;

    // Email küldése
    sendEmail('antalijanos76@gmail.com', subject, message);

    // Cache frissítése
    alertCache.set(ip, Date.now());

    console.warn('Bot alert email sent for IP:', ip);

  } catch (err) {
    console.error('Bot alert error:', err);
  }

  next();
};
