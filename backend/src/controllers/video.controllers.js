const e = require('express');
const pool = require('../config/db');
const { uploadToR2 } = require('../services/r2.service'); 
const { getSignedVideoUrl } = require('../services/r2.service');

const uploadVideo = async (req, res) => {
  try {
    const { title, category_id, subcategory_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = await uploadToR2(req.file);

    const result = await pool.query(
      `INSERT INTO videos (title, url, category_id, subcategory_id)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, fileUrl, category_id, subcategory_id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

const getVideos = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.query;

    let query = `
      SELECT v.*, c.name as category, s.name as subcategory
      FROM videos v
      LEFT JOIN categories c ON v.category_id = c.id
      LEFT JOIN subcategories s ON v.subcategory_id = s.id
    `;

    const values = [];
    const conditions = [];

    if (categoryId) {
      values.push(categoryId);
      conditions.push(`v.category_id = $${values.length}`);
    }

    if (subcategoryId) {
      values.push(subcategoryId);
      conditions.push(`v.subcategory_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY v.created_at DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching videos' });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM videos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM videos WHERE id = $1', [id]);

    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting video' });
  }
};

const streamVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT url FROM videos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const key = result.rows[0].url;

    // 🔥 aquí luego irá auth
    // if (!user.hasAccess) return res.status(403)

    const signedUrl = await getSignedVideoUrl(key);

    // 🔥 magia aquí
    res.redirect(signedUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error streaming video' });
  }
};

module.exports = { uploadVideo, getVideos, getVideoById, getVideoUrl, deleteVideo, streamVideo };