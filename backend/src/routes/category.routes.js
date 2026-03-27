const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');

router.post('', controller.createCategory);
router.get('', controller.getCategories);

module.exports = router;