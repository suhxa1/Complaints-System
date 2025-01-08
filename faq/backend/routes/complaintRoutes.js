// routes/complaints.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createComplaint,
    getAllComplaints,
    editComplaint,
    deleteComplaint,
} = require('../controller/complaintController');

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Define routes using controller methods
router.post('/', upload.single('image'), createComplaint);
router.get('/', getAllComplaints);
router.put('/:id', editComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;
