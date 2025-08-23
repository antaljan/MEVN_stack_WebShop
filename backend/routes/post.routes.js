const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { uploadMiddleware } = require('../middleware/upload');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const upload = require('../middleware/upload');

router.post('/new',authenticateToken, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.delete('/:id', authenticateToken, postController.deletePost);
router.put('/:id', uploadMiddleware, postController.updatePost);

module.exports = router;
