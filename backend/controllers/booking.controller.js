const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const { getDb } = require('../db/mongo');
const bcrypt = require('bcrypt');
const { error } = require('console');
require('dotenv').config();

// creane slots in the calendar
exports.createSlot = async (req, res) => {
  const { title, start, end, classe, user } = req.body;
  console.log('registring new slot to calendar');
  try {
    const collection = getDb().collection('booking');
    const result = await collection.insertOne({ title, start, end, classe, user });
    if (result.acknowledged) {
      console.log('register successful');
      try {
        await emailService.sendEmail(
          user.email,
          'Időpont foglalás',
          `Kedves ${user.firstname}, köszönöm, hogy megtisztelt bizalmával és lefoglalta egy időpontot. A foglalás részletei: ${title} - ${start} - ${end}.`
        );
        console.log('email sent about booking');
        res.status(201).json({ ok: true, insertedId: result.insertedId });
      } catch (mailError) {
        await collection.deleteOne({ _id: result.insertedId });
        console.log('email sending failure');
        res.status(500).send(`Slot creation failed due to email error: ${mailError.message}`);
      }
    } else {
      console.log('database registration failure no answer');
      res.status(500).json({ ok: false, error: 'Slot booking failed.' });
    }
  } catch (error) {
    console.log('database registration failure:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Get all slots from the calendar
exports.getAllSlots = async (req, res) => {
  try {
    const events = await getDb().collection('booking').find({}).toArray();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete slot from calendar
exports.deleteSlot = async (req, res) => {
    const slotId = req.params.id;
    try {
        const collection = getDb().collection('booking');
        const result = await collection.deleteOne({ _id: ObjectId(slotId) });
        if (result.deletedCount === 1) {
        console.log('Slot deleted successfully');
        res.status(200).json({ ok: true, message: 'Slot deleted successfully.' });
        } else {
        console.log('Slot not found');
        res.status(404).json({ ok: false, error: 'Slot not found.' });
        }
    } catch (error) {
        console.log('Error deleting slot:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
};

// update slot in calendar
exports.updateSlot = async (req, res) => {
    const slotId = req.params.id;
    const { title, start, end, classe, user } = req.body;
    try {
        const collection = getDb().collection('booking');
        const result = await collection.updateOne(
            { _id: ObjectId(slotId) },
            { $set: { title, start, end, classe, user } }
        );
        if (result.modifiedCount === 1) {
            console.log('Slot updated successfully');
            res.status(200).json({ ok: true, message: 'Slot updated successfully.' });
        } else {
            console.log('Slot not found or no changes made');
            res.status(404).json({ ok: false, error: 'Slot not found or no changes made.' });
        }
    } catch (error) {
        console.log('Error updating slot:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
};

// Get slots by date
exports.getSlotsByDate = async (req, res) => {
    const date = req.params.date;
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const collection = getDb().collection('booking');
        const slots = await collection.find({
            start: { $gte: startOfDay, $lte: endOfDay }
        }).toArray();
            res.status(200).json(slots);
    } catch (error) {
        console.log('Error fetching slots by date:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
};
