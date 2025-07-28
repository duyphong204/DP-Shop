const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// muter setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage});

router.post("/", upload.single('image'),async (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // function handle the stream upload to cloudinary 
        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                // use streamifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        }
        // upload the file to cloudinary
        const result = await streamUpload(req.file.buffer);
        return res.status(200).json({ message: "File uploaded successfully", url: result.secure_url });
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
})

module.exports = router;