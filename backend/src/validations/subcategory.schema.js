const { z } = require('zod');

const createSubcategorySchema = z.object({
  name: z.string().min(1),
  category_id: z.coerce.number()
});

module.exports = { createSubcategorySchema };