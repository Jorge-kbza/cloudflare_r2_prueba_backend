const pool = require('../config/db');

const createSubcategory = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    const result = await pool.query(
      'INSERT INTO subcategories (name, category_id) VALUES ($1, $2) RETURNING *',
      [name, category_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating subcategory' });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const result = await pool.query(
      'SELECT * FROM subcategories WHERE category_id = $1',
      [categoryId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching subcategories' });
  }
};

module.exports = { createSubcategory, getSubcategories };