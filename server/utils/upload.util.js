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
  // Allowed file types mapping
  const allowedTypes = {
    image: {
      regex: /jpeg|jpg|png|gif/,
      exts: ['.jpg', '.jpeg', '.png', '.gif'],
      mimetypes: ['image/jpeg', 'image/png', 'image/gif']
    },
    document: {
      regex: /pdf|doc|docx/,
      exts: ['.pdf', '.doc', '.docx'],
      mimetypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/x-pdf']
    },
    excel: {
      regex: /xlsx|xls|csv/,
      exts: ['.xlsx', '.xls', '.csv'],
      mimetypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
    }
  };

  const filterType = req.filterType || 'all';
  const fileExt = path.extname(file.originalname).toLowerCase();
  const fileMime = file.mimetype.toLowerCase();

  let isAllowed = false;

  if (filterType === 'all') {
    // Check against all categories
    isAllowed = Object.values(allowedTypes).some(type => 
      type.exts.includes(fileExt) || type.mimetypes.includes(fileMime) || type.regex.test(fileMime)
    );
  } else if (allowedTypes[filterType]) {
    const type = allowedTypes[filterType];
    isAllowed = type.exts.includes(fileExt) || type.mimetypes.includes(fileMime) || type.regex.test(fileMime);
  }

  // Final fallback: if it's a generic stream but has a valid extension, allow it
  if (!isAllowed && fileMime === 'application/octet-stream') {
    const allExts = Object.values(allowedTypes).flatMap(t => t.exts);
    if (allExts.includes(fileExt)) isAllowed = true;
  }

  if (isAllowed) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${fileExt}, ${fileMime}). Please upload images, PDFs, or documents.`));
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
