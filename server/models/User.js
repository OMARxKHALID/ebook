const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    cart: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // Security: Never return password
      },
    },
  },
);

module.exports = mongoose.model("User", UserSchema);
