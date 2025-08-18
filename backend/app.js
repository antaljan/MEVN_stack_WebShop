/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 * It connects to a MongoDB database and provides an endpoint like CRUD API.
 */

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Import routes
const newsletterRoutes = require('./routes/newsletter.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const emailRoutes = require('./routes/email.routes');
const uploadRoutes = require('./routes/upload.routes');
const bookingRoutes = require('./routes/booking.routes');
const trackingRoutes = require('./routes/tracking')

// Middleware, services, controllers
const emailService = require('./services/email.service');
const newsletterModel = require('./models/newsletter.model');
const { connect } = require('./db/mongo');
const authenticateToken = require('./middleware/auth');
const logger = require('./middleware/logger');

// 🕒 Importáljuk a cron időzítőt
const { startNewsletterScheduler } = require('./utils/newsletterScheduler');

// Load environment variables from .env file
const uri = process.env.MONGODB_URI;
const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;

// Ellenőrzés: szükséges környezeti változók
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}
if (!gmxUser || !gmxPass) {
  console.error("Error: GMX_USER and/or GMX_PASS environment variables are not set.");
  process.exit(1);
}

// Create an Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('trust proxy', true);
app.use('/newsletter', newsletterRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/email', emailRoutes);
app.use('/booking', bookingRoutes);
app.use('/track', trackingRoutes)
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(logger);

// Példa védett végpontra
app.post('/some-protected-endpoint', authenticateToken, (req, res) => {
  res.send('Sikeres hozzáférés védett végponthoz!');
});

// Start of the server
connect().then(() => {
  newsletterModel.init();

  // 🟢 Cron időzítő indítása
  startNewsletterScheduler();

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port:3000 http://localhost:3000');
  });
}).catch(err => {
  console.error('Fehler beim Verbinden zur Datenbank:', err);
});
