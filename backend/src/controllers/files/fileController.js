const connection = require("../../config/db");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
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
        res.status(200).json({
            idArchivo,
            message: "Archivo insertado"
        });
    } catch (error) {
        next(error);
    }
}

async function getFile(req,res,next){
    const { idArchivo } = req.params;
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
        res.json({ url });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    postFile,
    getFile,
    postArchivo
}