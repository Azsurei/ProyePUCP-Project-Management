const connection = require("../../config/db");
const XLSX = require('xlsx');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
//import multer from "multer";

//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
async function exportarReporteExcel(req,res,next){
    const {fileId} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        
        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log(jsonData);
        const wb = XLSX.utils.book_new();
        probandoExcelPresupuesto(jsonData,wb);

        const excelFilePath = path.join(destinationFolder, `${fileId}.xlsx`);

        res.download(excelFilePath , `${fileId}.json`, async(err) => {
            try {
                // Eliminar el archivo temporal de forma asíncrona
                await fsp.unlink(tmpFilePath);
                await fsp.unlink(excelFilePath);
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

async function generarReporte(req, res, next) {
    const {idProyecto,nombre,presupuesto} = req.body;
    res.status(200);
    try {
        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,13,nombre]);
        const idReporte = results[0][0].idReporte;

        //let workbook = await probandoExcelPresupuesto(presupuesto);
        
        var tmpFilePath = generarPathPresupuesto(presupuesto,idReporte)
        const authClient = await authGoogle.authorize();

        const fileMetadata = {
            name: `Reporte-Presupuesto-${idReporte}.json`,
            parents:['1yjLLozOQpvB0NFPq0OBQgKj2TSN4fEmJ']
        }

        const media = {
            mimeType: 'application/json',
            body: fs.createReadStream(tmpFilePath)
        };
    
        const driverResponse = await authGoogle.uploadFile(authClient,fileMetadata,media);
        const query2 = `CALL ACTUALIZAR_FILE_ID(?,?);`;
        const [results2] = await connection.query(query2, [idReporte,driverResponse.data.id]);
        fs.unlinkSync(tmpFilePath);
        res.status(200).json({
            presupuesto,
            message: "Se genero el reporte con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

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
        console.log(jsonData);

        res.status(200).json({
            jsonData,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    } 
}

async function convertirExcel2JSON(filePath){
    const workbook = XLSX.readFile(filePath);
    let result = {};
    workbook.SheetNames.forEach(sheetName =>{
        const woorksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(woorksheet);
        result[sheetName] = json;
    });
    return result;
}



function generarPathPresupuesto(presupuesto,idReporte){
    var tmpFilePath;
    try {
        tmpFilePath = `./tmp/presupuesto-${idReporte}.json`;
        console.log("Path nuevo "+tmpFilePath);
        fs.writeFileSync(tmpFilePath, JSON.stringify(presupuesto));
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}

async function probandoExcelPresupuesto(presupuesto,wb) {
    
    try {
        const {general,lineasPresupuesto} = presupuesto;
        
        //const wb = XLSX.utils.book_new();
        
        // Encabezados personalizados
        const headerGeneral = [["Nombre del proyecto","Reporte de Herramienta","Presupuesto inicial","Fecha de creacion","MonedaPrincipal","Meses del proyecto"]];
        const headerIngreso = [["Nro Linea", "Descripcion", "Monto", "Cantidad", "Fecha Transaccion", "Moneda", "Tipo Transaccion", "Tipo Ingreso"]];
        const headerEgreso = [["Nro Linea", "Descripcion", "Costo Real", "Cantidad", "Fecha Registro", "Moneda"]];
        const headerEstimacionCosto = [["Nro Linea", "Descripcion", "Tarifa Unitaria", "Cantidad Recurso","Subtotal", "Fecha Inicio", "Moneda", "Tiempo Requerido"]];

        const camposIngresos = ["idLineaIngreso","descripcion","monto","cantidad","fechaTransaccion","nombreMoneda","descripcionTransaccionTipo","descripcionIngresoTipo"];
        const camposEgresos = ["idLineaEgreso","descripcion","costoReal","cantidad","fechaRegistro","nombreMoneda"];
        const camposEstimacionCosto = ["idLineaEstimacion","descripcion","tarifaUnitaria","cantidadRecurso","subtotal","fechaInicio","nombreMoneda","tiempoRequerido"];
        const camposInfoGeneral = ["nombreProyecto","nombreHerramienta","presupuestoInicial","fechaCreacion","nombreMoneda","cantidadMeses"]
        
        const lineasIngresoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasIngreso, camposIngresos);
        const lineasEgresoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasEgreso, camposEgresos);
        const lineasEstimacionCostoReducidas = xlsxController.extraerCampos(lineasPresupuesto.lineasEstimacionCosto, camposEstimacionCosto);
        const infoGeneralReducida = xlsxController.extraerCampos(general,camposInfoGeneral);

        // Crear hojas y añadir encabezados
        xlsxController.agregarDatosAHoja(wb, headerGeneral, infoGeneralReducida, 'General');
        xlsxController.agregarDatosAHoja(wb, headerIngreso, lineasIngresoReducidas, 'Ingresos');
        xlsxController.agregarDatosAHoja(wb, headerEgreso, lineasEgresoReducidas, 'Egresos');
        xlsxController.agregarDatosAHoja(wb, headerEstimacionCosto, lineasEstimacionCostoReducidas, 'Estimaciones');
        
        // Guardar el archivo Excel
        //XLSX.writeFile(wb, 'presupuesto.xlsx', { compression: true });

        console.log(`Archivo Excel 'presupuesto.xlsx' guardado con éxito.`);
        return wb;
    } catch (error) {
        console.log(`Error en la funcion probandoExcelPresupuesto`+error); 
    }
}

function jsonToSheet(data) {
    const ws = XLSX.utils.json_to_sheet(data);
    return ws;
}

module.exports = {
    generarReporte,
    obtenerReporte,
    exportarReporteExcel
}