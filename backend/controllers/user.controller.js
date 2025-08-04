const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/mailer');
const { getDb } = require('../db/mongo');
require('dotenv').config();

exports.createUser = async (req, res) => {
  const { firstname, name, email, phone, rolle, adress, psw } = req.body;
  try {
    const collection = getDb().collection('users');
    const result = await collection.insertOne({ firstname, name, email, phone, rolle, adress, psw });

    if (result.acknowledged) {
      try {
        await transporter.sendMail({
          from: 'info@yowayoli.com',
          to: email,
          subject: 'Registration on yowayoli.com',
          text: `Dear ${firstname}, you have successfully registered on yowayoli.com!`,
        });
        res.status(201).json({ ok: true, insertedId: result.insertedId });
      } catch (mailError) {
        await collection.deleteOne({ _id: result.insertedId });
        res.status(500).send(`User creation failed due to email error: ${mailError.message}`);
      }
    } else {
      res.status(500).json({ ok: false, error: 'User creation failed.' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await getDb().collection('users').find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  const { id, ...updates } = req.body;
  try {
    const result = await getDb().collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 1) {
      res.status(200).send(`User ${id} updated.`);
    } else {
      res.status(404).send(`User ${id} not found.`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await getDb().collection('users').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).send(`User ${id} deleted.`);
    } else {
      res.status(404).send(`User ${id} not found.`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, psw } = req.body;
  try {
    const user = await getDb().collection('users').findOne({ email, psw });
    if (user) {
      const token = jwt.sign(
        { id: user._id, name: user.firstname, role: user.rolle },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ success: true, token, user: { name: user.firstname, role: user.rolle } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true });
};
