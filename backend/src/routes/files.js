const express = require("express");
const connection = require("../config/db");
const connections3 = require("../config/s3");
const routerFiles = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const fileController = require('../controllers/files/fileController');
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({storage:storage});
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({
    region: bucketRegion
});


routerFiles.post("/postFile",upload.single('image'), async (req, res) => {
    console.log(req.file);
    const params={
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.send();
});



module.exports.routerFiles = routerFiles;
