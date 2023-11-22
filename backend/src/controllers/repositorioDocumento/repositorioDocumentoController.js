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
    region
})

async function subirArchivo(req,res,next){
    console.log(req.file);
    const{idRepositorioDocumentos, extension} = req.body;
    const fileName = randomName();
    const params={
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const query = `CALL INSERTAR_ARCHIVOS(?,?);`;
    const query1 = `CALL INSERTAR_ARCHIVOS_REPOSITORIO(?,?,?,?);`;
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const [results] = await connection.query(query, [fileName, req.file.originalname]);
        const idArchivo = results[0][0].idArchivo;
        const [results1] = await connection.query(query1, [idArchivo, idRepositorioDocumentos, req.file.size, extension]);
        const idArchivoXRepositorioDocumento = results1[0][0].idArchivoXRepositorioDocumento;
        res.status(200).json({
            idArchivo,
            idArchivoXRepositorioDocumento,
            message: "Archivo insertado"
        });
    } catch (error) {
        next(error);
    }
}

async function listarArchivos(req,res,next){
    const{idRepositorioDocumentos} = req.params;
    const query = `CALL LISTAR_ARCHIVOS_X_IDREPOSITORIO(?);`;
    try {
        const [results] = await connection.query(query, [idRepositorioDocumentos]);
        const archivos = results[0];
        res.status(200).json({
            archivos,
            message: "Archivos listados"
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarArchivo(req,res,next){
    const{idArchivo} = req.body;
    const query = `CALL ELIMINAR_ARCHIVO_X_ID(?);`;
    try {
        const [results] = await connection.query(query, [idArchivo]);
        res.status(200).json({
            message: "Archivo eliminado"
        });
    } catch (error) {
        next(error);
    }
}

async function getArchivo(req,res,next){
    const { idArchivo } = req.params;
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
        res.status(200).json({
            url,
            message: "Archivo obtenido"
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
    }
}


async function eliminarXProyecto(idProyecto){
    console.log(`Procediendo: Eliminar repositorio de documento del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        console.log(`Repositorio del documento de Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en repositorio de documento X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_REPOSITORIODOCUMENTO_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en repositorio de documento X Proyecto", error);
        return 0;
    }
    return 1;
}

module.exports = {
    subirArchivo,
    listarArchivos,
    eliminarArchivo,
    getArchivo,
    eliminarXProyecto
};