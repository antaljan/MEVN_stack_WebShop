/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 * It connects to a MongoDB database and provides an endpoint like CRUD API.
 */

// Import necessary modules
const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
// Import routes, middliware, controllers
const newsletterRoutes = require('./routes/newsletter.routes');
const newsletterModel = require('./models/newsletter.model');
const emailService = require('./services/email.service');
const userRoutes = require('./routes/user.routes');
const { connect } = require('./db/mongo');
const authenticateToken = require('./middleware/auth');
const logger = require('./middleware/logger');

// Load environment variables from .env file
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;
// Check if the required environment variables are set
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}
if (!gmxUser || !gmxPass) {
  console.error("Error: GMX_USER and/or GMX_PASS environment variables are not set.");
  process.exit(1);
}

// Create a MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Create an Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/newsletter', newsletterRoutes);
app.use('/user', userRoutes);
app.use(logger); 

// példáulda a védett végpontra
app.post('/some-protected-endpoint', authenticateToken, (req, res) => {
  res.send('Sikeres hozzáférés védett végponthoz!');
});


// Endpoint to send an email
app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;
    console.log('router email:',email);
    try {
        await emailService.sendEmail(email, subject, message);
        res.status(200).send('E-Mail gesendet!');
      } catch (error) {
        console.error(error); // Failure loggen
        res.status(500).send(error.message); // give back the error message for Frontend
    }
});

// File upload functionality using Multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}
// Picture upload configuration with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using current timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 7 * 1024 * 1024 // max 7MB
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Nur Bilddateien sind erlaubt!'))
    }
  }
})

//  Route for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen' })
  }
  res.status(200).json({
    message: 'Datei erfolgreich hochgeladen',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  })
})

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir))

// Create Blogpost
app.post('/newpost',  async (req, res) => {
  try {
    const { language, title, subtitle, author, date, content , image } = req.body;
    const database = client.db('yowayoli');
    const collection = database.collection('blogposts');
    const result = await collection.insertOne({
      language,
      title,
      subtitle,
      author,
      date,
      content,
      image,
    });
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blogposts reading (Read, all)
app.get('/posts', async (req, res) => {
  try {
    const database = client.db('yowayoli');
    const collection = database.collection('blogposts');
    const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Read single Blogpost by ID
app.get('/posts/:id', async (req, res) => {
  try {
    const database = client.db('yowayoli');
    const collection = database.collection('blogposts');
    const post = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blogpost actualisieren (Update)
app.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, author, date, content } = req.body;
    let updateData = { title, subtitle, author, date, content };
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    const database = client.db('yowayoli');
    const collection = database.collection('blogposts');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    if (result.matchedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blogpost delete
app.delete('/posts/:id', async (req, res) => {
  try {
    const database = client.db('yowayoli');
    const collection = database.collection('blogposts');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// save About2 text protected with JWT
app.post('/saveabout', authenticateToken, async (req, res) => {
  console.log('saveabout called with user:', req.user.name ,' with role:', req.user.role);
  if (req.user.role !== 'admin') {
    console.log('Access denied for user:', req.user.name);
    return res.status(403).json({ error: 'Access denied' });
  }
  const { aboutText2, textlanguage } = req.body;
  if (!aboutText2) {
    console.log('aboutText2 is required');
    return res.status(400).json({ error: 'aboutText2 is required' });
  }
  try {
    const dirPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const filePath = path.join(dirPath, `aboutText2_${textlanguage}.html`);
    fs.writeFileSync(filePath, aboutText2);
    console.log(`Text saved to ${filePath}`);
    res.status(200).json({ success: true, message: 'Text gespeichert' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start of the server
connect().then(() => {
  newsletterModel.init();
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port:3000 http://localhost:3000');
  });
});