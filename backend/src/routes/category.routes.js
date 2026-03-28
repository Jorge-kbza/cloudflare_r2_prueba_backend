const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const validate = require('../middlewares/validate.middleware');
const { createCategorySchema } = require('../validations/category.schema');

router.post('', validate(createCategorySchema), controller.createCategory);
router.get('', controller.getCategories);

module.exports = router;