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
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

module.exports = upload;
