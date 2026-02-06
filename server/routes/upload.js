const router = require("express").Router();
const { upload } = require("../utils/cloudinary");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }
    res.status(200).json({ url: req.file.path });
  }),
);

module.exports = router;
