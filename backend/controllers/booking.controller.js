const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const { getDb } = require('../db/mongo');
const bcrypt = require('bcrypt');
const { error } = require('console');
require('dotenv').config();

// creane slots in the calendar
exports.createSlot = async (req, res) => {
  const { title, start, end, slotClass, user } = req.body;
  console.log('registering new slot to calendar');
  console.log('slotClass:', slotClass);
  console.log('user:', user);
  const defaultUser = {
    email: "n/a",
    name: "n/a",
    firstname: "n/a"
  };
  try {
    const collection = getDb().collection('booking');
    const result = await collection.insertOne({
      title,
      start,
      end,
      slotClass,
      user: user ?? defaultUser
    });
    console.log('register successful');
    res.status(201).json({ ok: true, insertedId: result.insertedId });
  } catch (error) {
    console.log('database registration failure:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};


// Get all slots from the calendar
exports.getAllSlots = async (req, res) => {
  try {
    const events = await getDb().collection('booking').find({}).toArray();
    console.log('Fetched all slots from the calendar');
    res.status(200).json(events);
  } catch (error) {
    console.log('Error fetching slots:', error);
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
const { title, start, end, class: slotClass, user } = req.body;
    try {
        const collection = getDb().collection('booking');
        const result = await collection.updateOne(
            { _id: ObjectId(slotId) },
            { $set: { title, start, end, class: slotClass, user } }
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
