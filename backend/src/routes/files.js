const express = require("express");
const connection = require("../config/db");
const connections3 = require("../config/s3");
const routerFiles = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const fileController = require('../controllers/files/fileController');
const multer = require("multer");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const storage = multer.memoryStorage();
const upload = multer({storage:storage});
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({
    region: bucketRegion
});

const imageName = randomImageName();
routerFiles.post("/postFile",upload.single('image'), async (req, res) => {
    console.log(req.file);
    const params={
        Bucket: bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.send();
});

routerFiles.get("/getFile",upload.single('image'), async (req, res) => {
    const {imageName} = req.params;
    const getObjectParams = {
        Bucket: bucketName,
        Key: imageName
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

});


module.exports.routerFiles = routerFiles;
