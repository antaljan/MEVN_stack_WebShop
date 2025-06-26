/**
 * NODE Express application for Backend functionality.
 * for sending emails using Nodemailer and GMX SMTP service.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser")
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://antalijanos76:CI02XvAiYdSlbujN@ajcluster.rtpdpvk.mongodb.net/?retryWrites=true&w=majority&appName=AjCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

// Nodemailer configuration for GMX SMTP service
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.net',
    port: 587,
    secure: false, // true für Port 465, false für 587
    auth: {
        user: 'asd0125@gmx.de', // GMX e-mail accont
        pass: 'SgdScrum25' // Passwort für das GMX-Konto
    },
    tls: {
        rejectUnauthorized: false
    }
});
module.exports = transporter;

// Connect to MongoDB 
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
