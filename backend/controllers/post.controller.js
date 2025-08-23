const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db/mongo');

const createPost = async (req, res) => {
  try {
    const { language, title, subtitle, author, date, content, image } = req.body;
    const result = await getDb().collection('blogposts').insertOne({
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
    const posts = await getDb().collection('blogposts').find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getPostById = async (req, res) => {
  try {
    const post = await getDb().collection('blogposts').findOne({ _id: new ObjectId(req.params.id) });
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

    const result = await getDb().collection('blogposts').updateOne(
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
    const result = await getDb().collection('blogposts').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Post not found" });
    }
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
};
