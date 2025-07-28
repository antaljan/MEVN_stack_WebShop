/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 * It connects to a MongoDB database and provides an endpoint like CRUD API.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser")
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// Load environment variables from .env file
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;
const jwt = require('jsonwebtoken')
// Check if the required environment variables are set
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}
if (!gmxUser || !gmxPass) {
  console.error("Error: GMX_USER and/or GMX_PASS environment variables are not set.");
  process.exit(1);
}
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
// Middleware to parse JSON request bodies
const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.de',
    port: 465,
    secure: true, // true für Port 465, false für 587
    auth: {
        user: gmxUser,
        pass: gmxPass
    },
    tls: {
        rejectUnauthorized: false
    }
});
// Connect to MongoDB once and keep the connection open for app usage
async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}
connectToMongoDB();
/**
 * POST /send-email
 * Endpoint to send an email using the provided email, subject, and message in the request body.
 */
app.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        await transporter.sendMail({
            from: 'info@yowayoli.com', // sender E-Mail, !!same like defined in tansporter!!
            to: 'antali.gyongyi@gmail.com', // receiver E-Mail, the mailaddress of admin
            subject: 'Üzenet a Honlapról!', // Subject of the email
            text: 'Név: '+subject+', email:'+email+', üzenet:'+message, //  plain text body
        });
        res.status(200).send('E-Mail gesendet!');
    } catch (error) {
        console.error(error); // Failure loggen
        res.status(500).send(error.message); // give back the error message for Frontend
    }
});
// Create user in datenbank
app.post('/create-user', async (req, res) => {
    const { firstname, name, email, phone, rolle, adress, psw } = req.body;
    try {
        const database = client.db('yowayoli');
        const collection = database.collection('users');
        const result = await collection.insertOne({ firstname, name, email, phone, rolle, adress, psw });
        if (result.acknowledged) {
            let mailError = null;
            try {
                await transporter.sendMail({
                    from: 'info@yowayoli.com',
                    to: email,
                    subject: 'Registration on yowayoli.com',
                    text: 'Dear '+firstname+', you have sucsesfull registred on yowayoli.com!',
                });
            } catch (error) {
                console.error('E-Mail konnte nicht gesendet werden:', error);
                mailError = error.message;
                const deleteThis = await collection.findone({ _id: result.insertedId });
                const result = await collection.deleteOne({ _id: new ObjectId(String(deleteThis._id)) });
                res.status(500).send(`User could not be created because email could not be sent: ${mailError}`);   
            }
            res.status(201).json({ ok: true, insertedId: result.insertedId, mailError });
        } else {
            res.status(500).json({ ok: false, error: "User could not be created" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message });
    }
});
// Read all users from datenbank
app.post('/get-users', async (req, res) => {
    try {
        const database = client.db('yowayoli');
        const collection = database.collection('users');
        const users = await collection.find({}).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
// Update user in datenbank
app.post('/update-user', async (req, res) => {
    const { id, firstname, name, email, phone, rolle, adress, psw } = req.body;  // Expecting an ID and user data in the request body
    try {
        const database = client.db('yowayoli');
        const collection = database.collection('users');
        const result = await collection.updateOne(
            { _id: new ObjectId(String(id)) }, // Filter by ID
            { $set: { firstname, name, email, phone, rolle, adress, psw } } // Update the user data
        );
        if (result.matchedCount === 1) {
            res.status(200).send(`User with ID ${id} updated successfully.`);

        } else {
            res.status(404).send(`User with ID ${id} not found.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
// Delete user from datenbank
app.post('/delete-user', async (req, res) => {
    const { id } = req.body;  // Expecting an ID in the request body  
    try {
        const database = client.db('yowayoli');
        const collection = database.collection('users');
        const result = await collection.deleteOne({ _id: new ObjectId(String(id)) });
        if (result.deletedCount === 1) {
            res.status(200).send(`User with ID ${id} deleted successfully.`);
        } else {
            res.status(404).send(`User with ID ${id} not found.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
// Login user
app.post('/login', async (req, res) => {
  const { email, psw } = req.body
  console.log('Login attempt for email:', email)
  try {
    const database = client.db('yowayoli')
    const collection = database.collection('users')
    const user = await collection.findOne({ email, psw })
    if (user) {
      console.log('Login successful for email:', email)
      // Token generálása
      const token = jwt.sign(
        {
          id: user._id,
          name: user.firstname,
          role: user.rolle
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      res.status(200).json({
        success: true,
        token,
        user: {
          name: user.firstname,
          role: user.rolle
        }
      })
    } else {
      console.log('Login failed for email:', email)
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})
// Restore user
app.post('/restoreuser', async (req, res) => {
  const { email } = req.body
  console.log('RestoreUser attempt for email:', email)
  try {
    const database = client.db('yowayoli')
    const collection = database.collection('users')
    const user = await collection.findOne({ email })
    if (user) {
      console.log('User found successful for email:', email)
      res.status(200).json({
        success: true,
        user: {
          name: user.firstname,
          role: user.rolle
        }
      })
    } else {
      console.log('User dosent for email:', email)
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})
// Logout user
app.post('/logout', (req, res) => {
    console.log('User logged out');
    res.status(200).json({ success: true });
});

// Für Datei-Uploads (z.B. Blog-Bilder)
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Ordner zum Speichern von Bildern
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Multer-Konfiguration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Einzigartige Dateiname erstellen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 7 * 1024 * 1024 // max 5MB
  },
  fileFilter: (req, file, cb) => {
    // Nur Bilder erlauben
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Nur Bilddateien sind erlaubt!'))
    }
  }
})

//  Route für Datei-Upload
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

// Statische Datei-Ausgabe für Vorschau (optional)
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

// Blogposts abrufen (Read, alle)
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

// Einzelnen Blogpost abrufen (Read, einer)
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

// Blogpost aktualisieren (Update)
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

// Blogpost löschen (Delete)
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
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { aboutText2 } = req.body;
  if (!aboutText2) {
    return res.status(400).json({ error: 'aboutText2 is required' });
  }

  try {
    const dirPath = path.join(__dirname, 'texts');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, `aboutText2_${req.user.language}.html`);
    fs.writeFileSync(filePath, aboutText2);
    res.status(200).json({ success: true, message: 'Text gespeichert' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Start of the server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port:3000 http://localhost:3000');
});