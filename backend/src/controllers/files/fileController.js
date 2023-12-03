const connection = require("../../config/db");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');
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

  async function subirArchivo(file){
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `attachment; filename="${file.originalname}"`
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

async function subirArchivoTest(req, res, next){
    console.log(req.file);
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ContentDisposition: `attachment; filename="${req.file.originalname}"`
    }
    const query = `CALL INSERTAR_ARCHIVOS(?,?);`;
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const [results] = await connection.query(query, [fileName, req.file.originalname]);
        const idArchivo = results[0][0].idArchivo;
        console.log(`Archivo ${idArchivo} insertado`);
        res.status(200).json({
            message: `Archivo ${idArchivo} insertado`
        });
    } catch (error) {
        console.log(error);
    }
}

async function descargarArchivo(req, res, next) {
    const { idArchivo } = req.params;
    const query = `CALL OBTENER_ARCHIVO(?);`;
    try {
        const [results] = await connection.query(query, [idArchivo]);
        const file = results[0][0];
        console.log(file.nombreGenerado);
        const command = getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: file.nombreGenerado,
            }),
            { expiresIn: 3600 } // URL expiration time in seconds
        );
        const url = await command;
        const nombreOriginal = file.nombreReal;
        res.setHeader('Content-Disposition', `attachment; filename="${nombreOriginal}"`);
        
        res.status(200).json({
            url,
            message: "Archivo obtenido"
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
    }
}

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
    console.log(file);
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    }
    const query = `CALL INSERTAR_ARCHIVOS(?,?);`;
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const [results] = await connection.query(query, [file.originalname, file.originalname]);
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
        const url = await getArchivo(idArchivo);
        res.json({ url });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getArchivo(idArchivo){
    const query = `CALL OBTENER_ARCHIVO(?);`;
    try {
        const [results] = await connection.query(query, [idArchivo]);
        const file = results[0][0];
        console.log(file.nombreGenerado);
        const command = getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: file.nombreGenerado,
            }),
            { expiresIn: 3600 } // URL expiration time in seconds
        );
        const url = await command;
        const nombreOriginal = file.nombreReal;
        res.setHeader('Content-Disposition', `attachment; filename="${nombreOriginal}"`);
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

async function descargarDesdeURL(url, rutaDestino) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(rutaDestino);

        https.get(url, (response) => {
            // Verificar si la respuesta es exitosa
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Falló la solicitud HTTP: Estado ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close(() => {
                    console.log('Archivo descargado correctamente');
                    resolve();
                });
            });
        }).on('error', (error) => {
            fs.unlink(rutaDestino, () => {}); // Eliminar archivo en caso de error
            console.error('Error al descargar el archivo:', error);
            reject(error);
        });

        file.on('error', (error) => { // Manejar errores de escritura de archivo
            fs.unlink(rutaDestino, () => {}); // Eliminar archivo en caso de error
            console.error('Error al escribir el archivo:', error);
            reject(error);
        });
    });
}

module.exports = {
    subirArchivo,
    descargarArchivo,
    postFile,
    getFile,
    postArchivo,
    getArchivo,
    funcGetJSONFile,
    descargarDesdeURL,
    subirArchivoTest
}