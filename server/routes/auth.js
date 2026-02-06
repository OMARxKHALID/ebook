const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const validate = require("../middleware/validateMiddleware");
const { registerSchema, loginSchema } = require("../schemas/authSchema");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }, // Short lived
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }, // Long lived
  );
  return { accessToken, refreshToken };
};

// REGISTER
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      res.status(400);
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    const savedUser = await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token: accessToken,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role,
      },
    });
  }),
);

// LOGIN
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Invalid email or password");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(400);
      throw new Error("Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      token: accessToken,
      user: { id: user._id, name: user.name, role: user.role },
    });
  }),
);

// REFRESH TOKEN
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("No refresh token provided");
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ token: accessToken });
    } catch (err) {
      res.status(403);
      throw new Error("Refresh token expired or invalid");
    }
  }),
);

// LOGOUT
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  }),
);

// GET PROFILE (Added for sync)
router.get(
  "/profile",
  require("../middleware/auth").verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("cart.book");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  }),
);

// UPDATE PROFILE
router.put(
  "/profile",
  require("../middleware/auth").verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  }),
);

// UPDATE PASSWORD
router.put(
  "/password",
  require("../middleware/auth").verifyToken,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Incorrect current password");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  }),
);

// SYNC CART
router.post(
  "/sync-cart",
  require("../middleware/auth").verifyToken,
  asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const user = await User.findById(req.user.id);
    if (user) {
      user.cart = cart.map((item) => ({
        book: item.id || item.book,
        quantity: item.quantity,
      }));
      await user.save();
    }
    res.json({ message: "Cart synced" });
  }),
);

module.exports = router;
