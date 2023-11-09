const {google} = require('googleapis');

const apikeys = require("../../config/apikeys.json");
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const fs = require('fs');

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
            resolve(file);
        });
    });
}

module.exports = {
    authorize,
    uploadFile
}