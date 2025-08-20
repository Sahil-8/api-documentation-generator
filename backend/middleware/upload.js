const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/json',
    'application/x-yaml',
    'text/yaml',
    'application/octet-stream', // for some YAML uploads
    'application/vnd.openapi+json',
    'application/vnd.postman.collection+json',
    'text/markdown',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(yaml|yml|json|md)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (increased from 5MB)
    files: 1
  }
});

// Add error handling for multer errors
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: 'File too large. Maximum file size is 25MB.' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          message: 'Too many files. Only one file allowed.' 
        });
      }
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;
