//Upload pictures from frontend for blogs and newsletters
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir);
  } catch (err) {
    console.error('Fehler beim Erstellen des Upload-Verzeichnisses:', err);
  }
}


// Picture upload configuration with Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using current timestamp and random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

// upload constante
const upload =  multer({
    storage: storage,
    limits: {
        fileSize: 7 * 1024 * 1024 // max 7MB
    },
    fileFilter: (req, file, cb) => {
        // Check if the file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
        cb(new Error('Nur Bilddateien sind erlaubt!'))
        }
    }
})

//  export upload
module.exports = {
  uploadMiddleware: upload.single('image'),
  upload // optionaler direkter Zugriff auf das Multer-Objekt
}

