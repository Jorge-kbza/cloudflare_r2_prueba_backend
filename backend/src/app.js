const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const videoRoutes = require('./routes/video.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'down' });
  }
});

app.use('/videos', videoRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoryRoutes);

module.exports = app;