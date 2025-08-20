const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins temporarily for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use("/api/auth", require("./routes/auth"));
console.log("Auth routes loaded");

app.use("/api/upload", require("./routes/upload"));
console.log("Upload routes loaded");

// CORS preflight handler
app.options("*", cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// All your actual routes first:
app.get("/", (req, res) => {
  res.send("API Documentation Generator Backend is running!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// PDF library health check
app.get("/health/pdf", (req, res) => {
  try {
    const pdf = require("html-pdf");
    const testHtml = "<html><body><h1>Test</h1></body></html>";
    
    pdf.create(testHtml, { format: "A4" }).toBuffer((err, buffer) => {
      if (err) {
        res.json({
          status: "ERROR",
          pdf: "Failed to generate test PDF",
          error: err.message,
          timestamp: new Date().toISOString()
        });
      } else {
        res.json({
          status: "OK",
          pdf: "Working correctly",
          timestamp: new Date().toISOString()
        });
      }
    });
  } catch (error) {
    res.json({
      status: "ERROR",
      pdf: "Library not available",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler LAST:
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
  });

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start server for Render and local development
const PORT = process.env.PORT || 5000;
console.log(`Attempting to start server on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `Process env keys:`,
  Object.keys(process.env).filter(
    (key) =>
      key.includes("RENDER") || key.includes("VERCEL") || key.includes("PORT")
  )
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Server is ready to accept connections`);
});

// Export for serverless environments
module.exports = app;
