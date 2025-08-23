const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth');


// Felhasználói műveletek
router.post('/create', userController.createUser);
router.post('/get', authenticateToken, userController.getUsers);
router.post('/update', authenticateToken, userController.updateUser);
router.post('/delete', authenticateToken, userController.deleteUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
