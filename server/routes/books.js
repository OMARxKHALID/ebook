const router = require("express").Router();
const Book = require("../models/Book");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const validate = require("../middleware/validateMiddleware");
const { bookSchema } = require("../schemas/bookSchema");

// GET ALL BOOKS (w/ Filters)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const qNew = req.query.new;
    const qFeatured = req.query.featured;
    let books;

    if (qNew === "true") {
      books = await Book.find({ isNewBook: true }).sort({ createdAt: -1 });
    } else if (qFeatured === "true") {
      books = await Book.find({ isFeatured: true }).sort({ createdAt: -1 });
    } else {
      books = await Book.find().sort({ createdAt: -1 });
    }

    res.status(200).json(books);
  }),
);

// GET BOOK BY ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    res.status(200).json(book);
  }),
);

// CREATE BOOK (Admin)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validate(bookSchema),
  asyncHandler(async (req, res) => {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  }),
);

const cloudinary = require("cloudinary").v2;

// Utility to extract public_id from Cloudinary URL
const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const folder = parts[parts.length - 2];
  const file = parts[parts.length - 1].split(".")[0];
  return `${folder}/${file}`;
};

// UPDATE BOOK (Admin)
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  validate(bookSchema.partial()), // Use partial for updates to allow selective fields
  asyncHandler(async (req, res) => {
    const oldBook = await Book.findById(req.params.id);

    // If updating image, delete old one from Cloudinary
    if (req.body.image && oldBook && oldBook.image !== req.body.image) {
      const publicId = getPublicId(oldBook.image);
      if (publicId)
        await cloudinary.uploader.destroy(publicId).catch(console.error);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!updatedBook) {
      res.status(404);
      throw new Error("Book not found");
    }
    res.status(200).json(updatedBook);
  }),
);

// DELETE BOOK (Admin)
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    // Delete image from Cloudinary
    const publicId = getPublicId(book.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(console.error);
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book has been deleted..." });
  }),
);

// BULK DELETE BOOKS (Admin)
router.post(
  "/bulk-delete",
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error("Please provide an array of book IDs");
    }

    // Get all books to delete their images
    const books = await Book.find({ _id: { $in: ids } });

    // Delete images from Cloudinary in parallel
    await Promise.all(
      books.map(async (book) => {
        const publicId = getPublicId(book.image);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId).catch(console.error);
        }
      }),
    );

    await Book.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json({ message: `${ids.length} books deleted successfully` });
  }),
);

module.exports = router;
