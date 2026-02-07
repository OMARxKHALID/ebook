const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const validate = require("../middleware/validateMiddleware");
const { orderSchema } = require("../schemas/orderSchema");

// CREATE ORDER
router.post(
  "/",
  verifyToken,
  validate(orderSchema),
  asyncHandler(async (req, res) => {
    const { books, totalAmount } = req.body;

    // Start a simple inventory check and snapshotting
    // Note: For real scale, use a Mongoose transaction
    const snapshottedBooks = [];

    for (const item of books) {
      // Atomically decrement stock only if sufficient
      const book = await Book.findOneAndUpdate(
        { _id: item.book, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!book) {
        const checkBook = await Book.findById(item.book);
        if (!checkBook) {
          res.status(404);
          throw new Error(`Book not found: ${item.book}`);
        } else {
          res.status(400);
          throw new Error(`Insufficient stock for "${checkBook.title}"`);
        }
      }

      // Snapshot details
      snapshottedBooks.push({
        book: book._id,
        title: book.title,
        image: book.image,
        price: book.discountPrice || book.originalPrice,
        quantity: item.quantity,
      });
    }

    const newOrder = new Order({
      books: snapshottedBooks,
      totalAmount,
      user: req.user.id,
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  }),
);

// GET MY ORDERS
router.get(
  "/my-orders",
  verifyToken,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id })
      .populate("books.book") // Populate book details
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  }),
);

// GET ALL ORDERS (Admin)
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate("books.book")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  }),
);

// GET SINGLE ORDER (Admin)
router.get(
  "/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("books.book")
      .populate("user", "name email");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(order);
  }),
);

// UPDATE ORDER STATUS (Admin)
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: req.body.status },
      },
      { new: true },
    );

    if (!updatedOrder) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(updatedOrder);
  }),
);

module.exports = router;
