const { ObjectId } = require('mongodb');
const { MongoClient } = require('../db/mongo'); // evtl. nur connect() nötig
const path = require('path');
const fs = require('fs');

const createPost = async (req, res) => {
  try {
    const { language, title, subtitle, author, date, content, image } = req.body;
    const db = MongoClient.db('yowayoli');
    const result = await db.collection('blogposts').insertOne({
      language,
      title,
      subtitle,
      author,
      date,
      content,
      image,
    });
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const db = MongoClient.db('yowayoli');
    const posts = await db.collection('blogposts').find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const db = MongoClient.db('yowayoli');
    const post = await db.collection('blogposts').findOne({ _id: new ObjectId(req.params.id) });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, subtitle, author, date, content } = req.body;
    const updateData = { title, subtitle, author, date, content };
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }

    const db = MongoClient.db('yowayoli');
    const result = await db.collection('blogposts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const db = MongoClient.db('yowayoli');
    const result = await db.collection('blogposts').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const saveAbout = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { aboutText2, textlanguage } = req.body;
  if (!aboutText2) {
    return res.status(400).json({ error: 'aboutText2 is required' });
  }

  try {
    const dirPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const filePath = path.join(dirPath, `aboutText2_${textlanguage}.html`);
    fs.writeFileSync(filePath, aboutText2);
    res.status(200).json({ success: true, message: 'Text gespeichert' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  saveAbout
};
