const e = require('express');
const pool = require('../config/db');
const { uploadToR2 } = require('../services/r2.service');

const uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;

    console.log('Received title:', req.body);
    console.log('Received file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fakeUrl = await uploadToR2(req.file);

    const result = await pool.query(
      'INSERT INTO videos (title, url) VALUES ($1, $2) RETURNING *',
      [title, fakeUrl]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

const getVideos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

module.exports = { uploadVideo, getVideos };