const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Felhasználói műveletek
router.post('/create', userController.createUser);
router.post('/get', userController.getUsers);
router.post('/update', userController.updateUser);
router.post('/delete', userController.deleteUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
