const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/auth");

// Upload file (field name must be 'file')
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadController.uploadFile
);

// Generate PDF from parsed data
router.post(
  "/generate-pdf",
  authMiddleware,
  uploadController.generatePDFFromData
);

module.exports = router;
