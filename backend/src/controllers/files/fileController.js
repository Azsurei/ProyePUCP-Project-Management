const connection = require("../../config/db");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");
const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
dotenv.config();
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({
    region: 'us-east-1'
});


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
        const [results] = await connection.query(query, [idProyecto]);
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        res.send();
        const [results] = await connection.query(query, [fileName, req.file.originalname]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    postFile,
}