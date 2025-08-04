const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const { getDb } = require('../db/mongo');
const bcrypt = require('bcrypt');
const { error } = require('console');
require('dotenv').config();

exports.createUser = async (req, res) => {
  const { firstname, name, email, phone, rolle, adress, psw } = req.body;
  console.log('user registry started for:',email);
  const hashedPsw = await bcrypt.hash(psw, 10);
  try {
    const collection = getDb().collection('users');
    const result = await collection.insertOne({ firstname, name, email, phone, rolle, adress, psw: hashedPsw });

    if (result.acknowledged) {
      console.log('database register successfull');
      try {
        await emailService.sendEmail(
          email,
          'Registration on yowayoli.com',
          `Dear ${firstname}, you have successfully registered on yowayoli.com!`
        );
        console.log('email send about registring');
        res.status(201).json({ ok: true, insertedId: result.insertedId });
      } catch (mailError) {
        await collection.deleteOne({ _id: result.insertedId });
        console.log('email sending failure');
        res.status(500).send(`User creation failed due to email error: ${mailError.message}`);
      }
    } else {
      console.log('database registration failure no answer');
      res.status(500).json({ ok: false, error: 'User creation failed.' });
    }
  } catch (error) {
    console.log('database registration failure:',error);
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
if (updates.psw) {
  updates.psw = await bcrypt.hash(updates.psw, 10);
}  try {
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
    const user = await getDb().collection('users').findOne({ email });
    const valid = await bcrypt.compare(psw, user?.psw);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, name: user.firstname, role: user.rolle },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ success: true, token, user: { name: user.firstname, role: user.rolle } });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true });
};
