/**
 * NODE Express application for Backend functionality.
 * Includes security layers: honeypot, rate limiting, bot detection with email alerts,
 * GeoIP logger, and all API routes.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const geoip = require('geoip-lite');
const { sendEmail } = require('./services/email.service');

// Routes
const newsletterRoutes = require('./routes/newsletter.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const emailRoutes = require('./routes/email.routes');
const uploadRoutes = require('./routes/upload.routes');
const bookingRoutes = require('./routes/booking.routes');
const trackingRoutes = require('./routes/tracking');
const dashboardRoutes = require('./routes/dashboard');
const contentRoutes = require('./routes/content.routes');
const contentUploadRoutes = require('./routes/contentUpload.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const logsStatsRoutes = require('./routes/logs.stats.routes');
const imagesRouter = require('./routes/images');

// Middleware
const authenticateToken = require('./middleware/auth');
const logger = require('./middleware/logger');          // új GeoIP logger
const botAlert = require('./middleware/botAlert');      // új bot detektálás + email riasztás

// Services
const newsletterModel = require('./models/newsletter.model');
const { connect } = require('./db/mongo');

// Cron
const { startNewsletterScheduler } = require('./utils/newsletterScheduler');
//const { startcleanupImages } = require('./utils/cleanupImages');

// Rate limiting
const rateLimit = require('express-rate-limit');

// Env vars
const uri = process.env.MONGODB_URI;
const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;

// Validate env vars
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}
if (!gmxUser || !gmxPass) {
  console.error("Error: GMX_USER and/or GMX_PASS environment variables are not set.");
  process.exit(1);
}

// Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('trust proxy', true);

// -------------------------------------------------------------
// 🛡️ 1) Honey-pot endpoint (bot csapda)
// -------------------------------------------------------------
app.get('/admin-secret-login', (req, res) => {
  console.warn('Honeypot triggered by IP:', req.ip);
  // GeoIP lookup
      const geo = geoip.lookup(ip);
  // send Email 
    const subject = `⚠️ Honeypot triggered by IP: ${req.ip}`;
    const message = `
Gyanús bot aktivitást észleltem a szerveren.

IP cím: ${ip}
Ország: ${geo?.country || 'ismeretlen'}
Város: ${geo?.city || 'ismeretlen'}
URL: ${url}
User-Agent: ${req.headers['user-agent']}
Időpont: ${new Date().toISOString()}

A fenti IP a honeypot céljára szolgáló végpontra érkezett kérés.
    `;
  sendEmail('antalijanos76@gmail.com', subject, message);
  res.status(404).send('Not found');
});

// -------------------------------------------------------------
// 🛡️ 2) Rate limiting (DoS / brute force védelem)
// -------------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Túl sok kérés erről az IP címről.'
});
app.use(limiter);

// -------------------------------------------------------------
// 🛡️ 3) Bot detektálás + email riasztás
// -------------------------------------------------------------
app.use(botAlert);

// -------------------------------------------------------------
// 📊 4) GeoIP logger (statisztika-barát loggolás)
// -------------------------------------------------------------
app.use(logger);

// -------------------------------------------------------------
// 🚀 5) API ROUTES
// -------------------------------------------------------------
app.use('/newsletter', newsletterRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/email', emailRoutes);
app.use('/booking', bookingRoutes);
app.use('/track', trackingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/content', contentRoutes);
app.use('/content-upload', contentUploadRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/logs', logsStatsRoutes);
app.use('/api/images', imagesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protected example
app.post('/some-protected-endpoint', authenticateToken, (req, res) => {
  res.send('Sikeres hozzáférés védett végponthoz!');
});

// -------------------------------------------------------------
// 🟢 Start server + Cron
// -------------------------------------------------------------
connect().then(() => {
  newsletterModel.init();
  startNewsletterScheduler();

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port:3000 http://localhost:3000');
  });
}).catch(err => {
  console.error('Fehler beim Verbinden zur Datenbank:', err);
});
