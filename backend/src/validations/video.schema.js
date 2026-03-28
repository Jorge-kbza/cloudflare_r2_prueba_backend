const { z } = require('zod');

const uploadVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category_id: z.coerce.number(),
  subcategory_id: z.coerce.number()
});

module.exports = { uploadVideoSchema };