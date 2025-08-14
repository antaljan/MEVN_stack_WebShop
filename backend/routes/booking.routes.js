const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');


// get all slots from calenrdar
router.get('/all', bookingController.getAllSlots);

// get all slots for a specific date
router.get('/:date', bookingController.getSlotsByDate);

// create a new slot in calendar
router.post('/new', bookingController.createSlot);

// delete a slot from calendar
router.delete('/:id', bookingController.deleteSlot);

// update a slot in calendar
router.put('/:id', bookingController.updateSlot);

module.exports = router;