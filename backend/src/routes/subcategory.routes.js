const express = require('express');
const router = express.Router();
const controller = require('../controllers/subcategory.controller');
const validate = require('../middlewares/validate.middleware');
const { createSubcategorySchema } = require('../validations/subcategory.schema');

router.post('', validate(createSubcategorySchema), controller.createSubcategory);
router.get('', controller.getSubcategories);

module.exports = router;