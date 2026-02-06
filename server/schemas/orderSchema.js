const { z } = require("zod");

const orderSchema = z.object({
  books: z
    .array(
      z.object({
        book: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Book ID"),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1, "Order must contain at least one book"),
  totalAmount: z.number().positive("Total amount must be positive"),
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
});

module.exports = { orderSchema };
