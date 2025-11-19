const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/products folder if it doesn't exist
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

// File filter - accept only images
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// 5 image limit
const uploadProductImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB each
  fileFilter
}).array('images', 5);

module.exports = { uploadProductImages };