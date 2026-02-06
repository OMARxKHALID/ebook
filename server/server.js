const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

// Critical Env Check
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "REFRESH_TOKEN_SECRET"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`CRITICAL ERROR: ${env} is not defined in .env file`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
const authRoute = require("./routes/auth");
const booksRoute = require("./routes/books");
const ordersRoute = require("./routes/orders");
const uploadRoute = require("./routes/upload");

app.use("/api/auth", authRoute);
app.use("/api/books", booksRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("E-Book Store API is running...");
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
