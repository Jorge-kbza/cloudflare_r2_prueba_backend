const pool = require('../config/db');

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;

    // ⚠️ de momento simulamos URL
    const fakeUrl = 'https://fake-url.com/video.mp4';

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