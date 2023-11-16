const connection = require("../../config/db");
const Exceljs = require('exceljs');
const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');
const fsp = require('fs').promises
const path = require('path');
const { error } = require("console");
const excelJSController = require("../xlxs/excelJSController");

const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};

const headerSubtitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};

const borderStyle = {
    top: {style:'thin', color: {argb:'000000'}},
    left: {style:'thin', color: {argb:'000000'}},
    bottom: {style:'thin', color: {argb:'000000'}},
    right: {style:'thin', color: {argb:'000000'}}
  };

  const alignmentCenterStyle = {
    vertical: 'middle',
    horizontal: 'center'
  };

async function obtenerJSON(req,res,next){
    const {fileId} = req.params;
    const destinationFolder = path.join(__dirname, '../../tmp');
    try{
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const riesgos = JSON.parse(fileContent);
        res.status(200).json({
            riesgos,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    }   
}



async function subirJSON(req, res, next) {
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

async function descargarExcel(req,res,next){
    const {fileId} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);

        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        //console.log(jsonData);
        const excelFilePath = path.join(destinationFolder, `${fileId}.xlsx`);
        workbook = await generarExcelRiesgos(jsonData);
        console.log(excelFilePath);

        await workbook.xlsx.writeFile(excelFilePath);

        res.download(excelFilePath, `${fileId}.xlxs`, async(err) => {
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

async function generarExcelRiesgos(riesgos){
   
    try{

        const workbook = new Exceljs.Workbook();
        const WSRiesgos = workbook.addWorksheet('Riesgos');

        let filaActual = 1;
        for (const riesgo of riesgos) {
            filaActual = await agregarRiesgoAExcel(riesgo, WSRiesgos, filaActual);
        }

        excelJSController.ajustarAnchoColumnas(WSRiesgos);
        return workbook;
    }catch(error){ 
        console.log(error);
    }
    
    return error;
}

async function agregarRiesgoAExcel(riesgo,WSRiesgos,filaActual){
    try{
        filaActual=await agregarDatosGeneralesAExcel(riesgo,WSRiesgos,filaActual);
        filaActual=await agregarResponsablesAExcel(riesgo.responsables,WSRiesgos,filaActual);
    }catch(error){
        console.log(error);
    }

}

async function agregarDatosGeneralesAExcel(riesgo,WSRiesgos,filaActual){
    try {
        const header0 = ["Nombre del riesgo","Fecha de identificacion"];
        const header1 = ["","Dueño del riesgo",""];
        const header2 = ["Nombres","Apellidos","Correo"];
        filaActual = await excelJSController.agregaHeader(WSRiesgos,filaActual,header0,headerTitulo);
        const formattedDate = await excelJSController.convertISOToDate(riesgo.fechaIdentificacion);
        WSRiesgos.getRow(filaActual).values = [riesgo.nombreRiesgo,formattedDate];
        filaActual +=2;

        filaActual = await excelJSController.agregaHeader(WSRiesgos,filaActual,header1,headerTitulo);
        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header2,headerSubtitulo);

        WSRiesgos.getRow(filaActual).values = [riesgo.nombres,riesgo.apellidos,riesgo.correoElectronico];
        filaActual+=2;

        const header3 = ["Detalle","Causa","Impacto","Estado del riesgo"];
        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header3,headerTitulo);
        WSRiesgos.getRow(filaActual).values = [riesgo.nombreRiesgo,riesgo.causaRiesgo,riesgo.impactoRiesgo,riesgo.estado];
        filaActual++;
        filaActual+=2;

        const header4 = ["Probabilidad"];
        const header5 = ["Descripcion","Porcentaje estimado"];

        //Header probabilidad
        WSRiesgos.getRow(filaActual).values = header4;
        WSRiesgos.getRow(filaActual).eachCell({ includeEmpty: true }, (cell) => {
            cell.style = {...headerTitulo, border: borderStyle};
          });
        WSRiesgos.mergeCells(filaActual, 1, filaActual, 2);
        const mergedCell = WSRiesgos.getCell(filaActual, 1);
        mergedCell.style = {
        ...mergedCell.style, // Mantén los estilos previos
        alignment: alignmentCenterStyle
        };
        filaActual++;

        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header5,headerTitulo);
        WSRiesgos.getRow(filaActual).values = [riesgo.nombreProbabilidad,riesgo.valorProbabilidad];
        filaActual+=2;

        const header6 = ["Impacto","Valor asociado"];
        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header6,headerTitulo);
        WSRiesgos.getRow(filaActual).values = [riesgo.nombreImpacto,riesgo.valorImpacto];
        filaActual+=2;

    } catch (error) {
        console.log(error);
    }
    return filaActual;
}



async function agregarResponsablesAExcel(responsables,WSRiesgos,filaActual){
    try{
        const header1 = ["","Responsables",""];
        const header2 = ["Nombres","Apellidos","Correo Electronico"];
        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header1,headerTitulo);
        filaActual =await excelJSController.agregaHeader(WSRiesgos,filaActual,header2,headerTitulo);

        for (const responsable of responsables) {
            console.log(`Fila actual: ${filaActual}, nombres: ${responsable.nombres}, apellidos: ${responsable.apellidos}, correo: ${responsable.correoElectronico}`);
            WSRiesgos.getRow(filaActual).values = [responsable.nombres, responsable.apellidos, responsable.correoElectronico];
            filaActual++;
        }
    }catch(error){
        console.log(error);
    }
    return filaActual;
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
    subirJSON,
    descargarExcel,
    obtenerJSON,
    generarExcelRiesgos
}