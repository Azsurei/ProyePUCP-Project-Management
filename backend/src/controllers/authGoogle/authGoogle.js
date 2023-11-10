const {google} = require('googleapis');

const apikeys = require("../../config/apikeys.json");
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const fs = require('fs');
const path = require('path');

async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    )

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient,fileMetadata,media){
    console.log("Uploading file...");
    return new Promise((resolve, reject) => {
        const drive = google.drive({version: 'v3', auth: authClient});

        drive.files.create({
            resource:fileMetadata,
            media:media,
            fields:'id'
        },function(err, file){
            if(err){
                return reject(err);
            }
            console.log("File Id: ", file.data.id);
            resolve(file);
        });
    });
}

async function downloadAndSaveFile(authClient, fileId, destinationFolder) {
    const drive = google.drive({ version: 'v3', auth: authClient });

    return new Promise((resolve, reject) => {
        drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
            if (err) {
                reject('Error al descargar el archivo: ' + err.message);
                return;
            }

            const filePath = path.join(destinationFolder, fileId + '.xlsx');
            const dest = fs.createWriteStream(filePath);

            res.data
                .pipe(dest)
                .on('finish', () => {
                    console.log('Descarga de archivo completada y escrita en el archivo.');
                    resolve(filePath);
                })
                .on('error', err => {
                    reject('Error al escribir el archivo: ' + err.message);
                });
        });
    });
}

async function getFileDetails(authClient, fileId) {
    const drive = google.drive({ version: 'v3', auth: authClient });

    return new Promise((resolve, reject) => {
        drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType, parents, modifiedTime, createdTime, size'
        }, (err, file) => {
            if (err) {
                console.error("Error fetching file:", err);
                return reject(err);
            }
            resolve(file.data);
        });
    });
}

module.exports = {
    authorize,
    uploadFile,
    getFileDetails,
    downloadAndSaveFile
}