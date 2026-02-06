const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(uploadsDir, req.uploadType || 'general');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    image: /jpeg|jpg|png|gif/,
    document: /pdf|doc|docx/,
    excel: /xlsx|xls|csv/,
    all: /jpeg|jpg|png|gif|pdf|doc|docx|xlsx|xls|csv/
  };

  const extname = allowedTypes[req.filterType || 'all'].test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes[req.filterType || 'all'].test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Custom middleware to set upload type
exports.setUploadType = (type) => {
  return (req, res, next) => {
    req.uploadType = type;
    next();
  };
};

// Custom middleware to set filter type
exports.setFilterType = (type) => {
  return (req, res, next) => {
    req.filterType = type;
    next();
  };
};

exports.upload = upload;

// Delete file utility
exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '../', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};
