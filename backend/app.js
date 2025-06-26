/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 * It connects to a MongoDB database and provides an endpoint like CRUD API.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser")
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const gmxUser = process.env.GMX_USER;
const gmxPass = process.env.GMX_PASS;

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

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: 'mail.gmx.net',
    port: 587,
    secure: false, // true für Port 465, false für 587
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
            from: 'asd0125@gmx.de', // sender E-Mail, !!same like defined in tansporter!!
            to: 'antalijanos76@gmail.com',
            subject: 'Üzenet a Honlapról!',
            text: 'Név: '+subject+', email:'+email+', üzenet:'+message,
        });
        res.status(200).send('E-Mail gesendet!');
    } catch (error) {
        console.error(error); // Failure loggen
        res.status(500).send(error.message); // give back the error message for Frontend
    }
});

// Start of the server
app.listen(3000, () => console.log('Server fut a 3000-es porton'));
