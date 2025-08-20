const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, upload.single("file"), uploadController.uploadFile);
router.post("/generate-pdf", authMiddleware, uploadController.generatePDFFromData);

module.exports = router;
