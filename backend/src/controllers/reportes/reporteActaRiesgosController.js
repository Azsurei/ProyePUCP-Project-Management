const connection = require("../../config/db");
const XLSX = require('xlsx');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');
const fsp = require('fs').promises
const path = require('path');

async function obtenerReporte(req,res,next){
    const {fileId} = req.params;
    const destinationFolder = path.join(__dirname, '../../tmp');
    console.log(destinationFolder);
    try{
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        console.log(tmpFilePath);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        res.status(200).json({
            jsonData,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    }   
}



async function generarReporte(req, res, next) {
    const {riesgos,idProyecto,nombre}=req.body;
    try {
        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,5,nombre]);
        const idReporte = results[0][0].idReporte;
        //workbook = generarExcelRiesgos(riesgos);
        
        var tmpFilePath = generarPathRiesgos(riesgos,idReporte);

        const authClient = await authGoogle.authorize();
        const fileMetadata = {
            name: `Reporte-Riesgos-${idReporte}.json`,
            parents:['1IG3gNqlgWuTWHKnisQiJ_TvZlpWhG8eu']
        }

        const media = {
            mimeType: 'application/json',
            body: fs.createReadStream(tmpFilePath)
        };

        const driverResponse = await authGoogle.uploadFile(authClient,fileMetadata,media);
        console.log(driverResponse.data.id);
        
        const query2 = `CALL ACTUALIZAR_FILE_ID(?,?);`;
        const [results2] = await connection.query(query2, [idReporte,driverResponse.data.id]);

        fs.unlinkSync(tmpFilePath);
        res.status(200).json({
            riesgos,
            fileId: driverResponse.data.id,
            message: "Se genero el reporte de entregables con exito",
        });
    } catch (error) {
        next(error);
    }
}

async function exportarReporteExcel(req,res,next){
    const {fileId} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        console.log(tmpFilePath);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        //console.log(jsonData);
        workbook = generarExcelRiesgos(jsonData);

        const excelFilePath = path.join(destinationFolder, `${fileId}.xlsx`);
        XLSX.writeFile(workbook, excelFilePath);

        console.log(jsonData);
        res.download(excelFilePath, `${fileId}.json`, async(err) => {
            try {
                // Eliminar el archivo temporal de forma asíncrona
                //await fsp.unlink(tmpFilePath);
            } catch (e) {
                console.error("Error al eliminar el archivo temporal:", e.message);
            }
            if (err) {
                next(err);
            }
        });
    }catch(error){
        console.error("Error al exportar el reporte Excel:", error.message);
        next(error);
    } 
}

function generarExcelRiesgos(riesgos){
    try{
        const wb = XLSX.utils.book_new();
        riesgos.forEach((riesgo,index) => {
            var filasHoja = [];
            generarWSCatalogo(riesgo,filasHoja);
            generarWSParticipantes(riesgo.responsables,filasHoja);

            var ws = XLSX.utils.json_to_sheet(filasHoja, {skipHeader:true});
            xlsxController.ajustarAnchoDeColumna(ws,filasHoja);
            XLSX.utils.book_append_sheet(wb, ws, `Riesgo ${index}`);
        });

        return wb;
    }catch(error){
        console.log(error);
    }
}

function generarWSParticipantes(responsables,filasHoja){
    try {
        filasHoja.push({});

        filasHoja.push({
            c1: "Elaborado por"
        })

        filasHoja.push({
            c1: "Nombre"
        })
        //console.log(responsables);
        responsables.forEach((responsable,index) => {
            filasHoja.push({
                c1: responsable.nombres + responsable.apellidos
            })
        });
    } catch (error) {
        console.log(error);
    }
}

function generarWSCatalogo(riesgo,filasHoja){
    try {

        filasHoja.push({
            c1: "ID",
            c2: "Riesgo",
            c3: "Causa",
            c4: "Impacto",
            c5: "Fecha identificacion",
            c6: "Probabilidad",
            c7: "Impacto",
            c8: "Severidad",
            c9: "Dueño del Riesgo",
            c10: "Planes de respuesta",
            c11: "Responsable Ejecucion",
            c12: "Planes de Contingencia",
            c13: "Estado"    
        })

        filasHoja.push({
            c1: riesgo.idRiesgo,
            c2: riesgo.nombreRiesgo,
            c3: riesgo.causaRiesgo,
            c4: riesgo.impactoRiesgo,
            c5: riesgo.fechaIdentificacion,
            c6: riesgo.nombreProbabilidad,
            c7: riesgo.nombreImpacto,
            c8: riesgo.nombres+" "+ riesgo.apellidos,
            c9: riesgo.estado
        })

        
    } catch (error) {
        console.log(error);
    }
}

function agregarResponsablesAHoja(responsables,filasHoja){
    try {
        filasHoja.push({
            c1: "Responsables"
        })
        responsables.forEach((responsable,index) => {
            filasHoja.push({
                c1: responsable.nombres+" "+responsable.apellidos,
                c2: responsable.correoElectronico
            })
        });
    } catch (error) {
        console.log(error);
    }
}
function generarPathRiesgos(riesgos,idReporte){
    var tmpFilePath;
    try {
        tmpFilePath = `./tmp/riesgos-${idReporte}.json`;
        console.log("Path nuevo "+tmpFilePath);
        fs.writeFileSync(tmpFilePath, JSON.stringify(riesgos));
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}
module.exports = {
    generarReporte,
    exportarReporteExcel,
    obtenerReporte
}