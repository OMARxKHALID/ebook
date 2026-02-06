const { z } = require("zod");

const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  image: z.string().url("Must be a valid URL"),
  originalPrice: z.number().positive("Price must be a positive number"),
  discountPrice: z.number().nonnegative("Discount price cannot be negative"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(0).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isNewBook: z.boolean().optional(),
  category: z.string().min(2, "Category must be at least 2 characters"),
  stock: z.number().int().nonnegative("Stock cannot be negative").default(10),
});

module.exports = { bookSchema };
