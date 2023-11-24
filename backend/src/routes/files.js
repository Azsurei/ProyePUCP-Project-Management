const express = require("express");
const connection = require("../config/db");
const routerFiles = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const fileController = require('../controllers/files/fileController');
const multer = require("multer");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");


dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const storage = multer.memoryStorage();
const upload = multer({storage:storage});
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;


routerFiles.post("/subirArchivo",upload.single('file'), fileController.subirArchivo);
routerFiles.get("/descargarArchivo/:idArchivo", fileController.descargarArchivo);

routerFiles.post("/postFile",upload.single('file'), fileController.postFile);

routerFiles.get("/getFile/:idArchivo", fileController.getFile);

routerFiles.post("/postArchivo",upload.single('file'), fileController.postFile);

routerFiles.get("/getArchivo/:idArchivo", fileController.getArchivo);


module.exports.routerFiles = routerFiles;
