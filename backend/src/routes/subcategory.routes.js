const express = require('express');
const router = express.Router();
const controller = require('../controllers/subcategory.controller');

router.post('', controller.createSubcategory);
router.get('', controller.getSubcategories);

module.exports = router;