const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

router.post("/", upload.single("file"), uploadController.uploadFile);
router.post("/generate-pdf", uploadController.generatePDFFromData);

module.exports = router;
