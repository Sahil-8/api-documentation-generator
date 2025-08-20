const PDFDocument = require("pdfkit");

// Handle file upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading file" });
  }
};

// Generate PDF from parsed data
exports.generatePDFFromData = async (req, res) => {
  try {
    const { parsedData, fileName } = req.body;

    if (!parsedData) {
      return res.status(400).json({ message: "No parsed data provided" });
    }

    const safeFileName = (fileName || "documentation").replace(/"/g, "");
    const doc = new PDFDocument({ margin: 40 });

    // Response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}.pdf"`
    );

    // Pipe PDF stream directly to response
    doc.pipe(res);

    // Title
    doc.fontSize(18).text(`API Documentation: ${safeFileName}`, {
      align: "center",
    });
    doc.moveDown();

    // Turn parsedData into readable text
    const jsonString =
      typeof parsedData === "string"
        ? parsedData
        : JSON.stringify(parsedData, null, 2);

    // Write line by line, add new pages if needed
    const lines = jsonString.split("\n");
    lines.forEach((line) => {
      if (doc.y > doc.page.height - 50) doc.addPage();
      doc.fontSize(10).text(line, { align: "left" });
    });

    // End the document
    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: err.message });
  }
};
