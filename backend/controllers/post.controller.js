const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db/mongo');
const sanitizeHtml = require('sanitize-html');


const sanitizeContent = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'u',
      'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4',
      'a'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      'a': (tagName, attribs) => {
        return {
          tagName: 'a',
          attribs: {
            ...attribs,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        };
      }
    }
  });
};

const createPost = async (req, res) => {
  try {
    const { language, title, subtitle, author, date, content, image } = req.body;
    if (!title || !author || !date || !content || !language) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const sanitizedContent = sanitizeContent(content);
    const result = await getDb().collection('blogposts').insertOne({
      language,
      title,
      subtitle,
      author,
      date,
      content: sanitizedContent,
      image,
      createdAt: new Date()
    });
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { language } = req.query;
    const filter = {};
    if (language) {
      filter.language = language;
    }
    const posts = await getDb()
      .collection('blogposts')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
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
    const { title, subtitle, author, date, content, image } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (author !== undefined) updateData.author = author;
    if (date !== undefined) updateData.date = date;
    if (image !== undefined) updateData.image = image;
    if (content !== undefined) {
      updateData.content = sanitizeContent(content);
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
    console.error('Error updating post:', error);
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
