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
    console.log('Registrierung:', firstname, name, email, psw, phone, rolle, adress);
    // Check if all required fields are provided
    try {
        const database = client.db('yowayoli');
        const collection = database.collection('users');
        const result = await collection.insertOne({ firstname, name, email, phone, rolle, adress, psw });
        console.log('User created:', result);
        res.status(201).send(`User created with ID: ${result.insertedId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
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
// Start of the server
app.listen(3000, () => console.log('Server is running on port:3000 http://localhost:3000'));
