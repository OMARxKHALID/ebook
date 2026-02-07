const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewBook: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: "General",
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

module.exports = mongoose.model("Book", BookSchema);
