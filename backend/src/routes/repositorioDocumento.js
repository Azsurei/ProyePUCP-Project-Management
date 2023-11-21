const express = require("express");
const routerRepositorioDocumentos = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const repositorioDocumentoController = require('../controllers/repositorioDocumento/repositorioDocumentoController');
const multer = require("multer");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");


dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({storage:storage});


routerRepositorioDocumentos.post("/subirArchivo",upload.single('file'), repositorioDocumentoController.subirArchivo);
routerRepositorioDocumentos.get("/listarArchivos/:idRepositorioDocumentos", repositorioDocumentoController.listarArchivos);
routerRepositorioDocumentos.get("/getArchivo/:idArchivo", repositorioDocumentoController.getArchivo);
routerRepositorioDocumentos.delete("/eliminarArchivo", repositorioDocumentoController.eliminarArchivo);

module.exports.routerRepositorioDocumentos = routerRepositorioDocumentos;
