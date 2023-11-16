const connection = require("../../config/db");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const fetch = require("node-fetch");
const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
dotenv.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const sessiontoken = process.env.AWS_SESSION_TOKEN
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region/*,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessiontoken
    */
  })


async function postFile(req,res,next){
    console.log(req.file);
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const query = `CALL INSERTAR_ARCHIVOS(?,?);`;
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const [results] = await connection.query(query, [fileName, req.file.originalname]);
        const idArchivo = results[0][0].idArchivo;
        res.status(200).json({
            idArchivo,
            message: "Archivo insertado"
        });
    } catch (error) {
        next(error);
    }
}

async function postArchivo(file){
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    }
    const query = `CALL INSERTAR_ARCHIVOS(?,?);`;
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const [results] = await connection.query(query, [fileName, file.originalname]);
        const idArchivo = results[0][0].idArchivo;
        console.log(`Archivo ${idArchivo} insertado`);
        return idArchivo;
    } catch (error) {
        console.log(error);
    }
}

async function getFile(req,res,next){
    const { idArchivo } = req.params;
    try {
        const url = await funcGetFile(idArchivo);
        res.json({ url });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function funcGetFile(idArchivo){
    const query = `CALL OBTENER_ARCHIVO(?);`;
    try {
        const [results] = await connection.query(query, [idArchivo]);
        const file = results[0][0];
        console.log(file.nombre_s3);
        // Create a presigned URL for the file
        const command = getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: file.nombre_s3,
            }),
            { expiresIn: 3600 } // URL expiration time in seconds
        );
        const url = await command;
        return url;
    } catch (error) {
        console.error("Error generating signed URL:", error);
    }
}

async function funcGetJSONFile(idArchivo) {
    const query = `CALL OBTENER_ARCHIVO(?);`;
    try {
        const [results] = await connection.query(query, [idArchivo]);
        const file = results[0][0];
        console.log(file.nombreGenerado);

        // Create a presigned URL for the file
        const command = getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: file.nombreGenerado,
            }),
            { expiresIn: 3600 } // URL expiration time in seconds
        );

        const url = await command;
        console.log("========================================");
        console.log(url);
        // Fetch the JSON data from the signed URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json(); // This parses the JSON

        return jsonData; // Return the JSON data
    } catch (error) {
        console.error("Error getting JSON data:", error);
    }
}
module.exports = {
    postFile,
    getFile,
    postArchivo,
    funcGetFile,
    funcGetJSONFile
}