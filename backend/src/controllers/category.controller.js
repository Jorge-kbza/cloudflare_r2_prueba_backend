const pool = require('../config/db');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

module.exports = { createCategory, getCategories };