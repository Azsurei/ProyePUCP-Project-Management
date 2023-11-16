const connection = require("../../config/db");
const XLSX = require('xlsx');
const Exceljs = require('exceljs');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const excelJSController = require("../xlxs/excelJSController");
//import multer from "multer";

//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

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

//Borde para la celda de excel
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

async function descargarExcel(req,res,next){
    const {fileId} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        const authClient = await authGoogle.authorize();
        const tmpFilePath = await authGoogle.downloadAndSaveFile(authClient,fileId,destinationFolder);
        
        const fileContent = await fsp.readFile(tmpFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const excelFilePath = path.join(destinationFolder, `${fileId}.xlsx`);
        console.log(excelFilePath);
        workbook = await generarExcelPresupuesto(jsonData);
        
        await workbook.xlsx.writeFile(excelFilePath);

        res.download(excelFilePath , `${fileId}.xlxs`, async(err) => {
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

async function generarExcelPresupuesto(presupuesto){

    try{
        const workbook = new Exceljs.Workbook();
        let filactual=1;

        const WSGeneral = workbook.addWorksheet('General');
        await agregarInformacionGeneralAExcel(presupuesto.general,WSGeneral,filactual);

        if(presupuesto.lineasPresupuesto.lineasIngreso!=null){
            console.log('Llegue');
            const WSIngresos = workbook.addWorksheet('Ingresos');
            await agregarIngresosAExcel(presupuesto.lineasPresupuesto.lineasIngreso,WSIngresos,filactual);
            excelJSController.ajustarAnchoColumnas(WSIngresos);
        }
        
        if(presupuesto.lineasPresupuesto.lineasEgreso!=null){
            const WSEgresos = workbook.addWorksheet('Egresos');
            await agregarEgresosAExcel(presupuesto.lineasPresupuesto.lineasEgreso,WSEgresos,filactual);
            excelJSController.ajustarAnchoColumnas(WSEgresos);
        }

        if(presupuesto.lineasPresupuesto.lineasEstimacionCosto!=null){
            const WSEstimacionCosto = workbook.addWorksheet('Estimaciones');
            await agregarEstimacionesCostoAExcel(presupuesto.lineasPresupuesto.lineasEstimacionCosto,WSEstimacionCosto,filactual);
            excelJSController.ajustarAnchoColumnas(WSEstimacionCosto);
        }

        excelJSController.ajustarAnchoColumnas(WSGeneral);
        return workbook;
        
    }catch(error){
        console.log(error);
    }
}

async function agregarInformacionGeneralAExcel(general,WSGeneral,filaActual){
    try{
        const header1 = ["Proyecto asociado","Fecha de creacion de reporte"]
        const header2 = ["Presupuesto inicial","Moneda principal","Meses del proyecto"];
        filaActual = await excelJSController.agregaHeader(WSGeneral,filaActual,header1,headerTitulo,borderStyle);
        WSGeneral.getRow(filaActual).values = [general.nombreProyecto,general.fechaCreacion];
        filaActual++;

        filaActual =await excelJSController.agregaHeader(WSGeneral,filaActual,header2,headerTitulo,borderStyle);
        WSGeneral.getRow(filaActual).values = [general.presupuestoInicial,general.nombreMoneda,general.cantidadMeses];
        filaActual++;
    }catch(error){
        console.log(error);
    }
}

async function agregarIngresosAExcel(lineasIngreso,WSIngresos,filactual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Monto", "Cantidad", "Fecha Transaccion", "Moneda", "Tipo Transaccion", "Tipo Ingreso"];
        let i=1;
        filactual = await excelJSController.agregaHeader(WSIngresos,filactual,header1,headerTitulo,borderStyle);
        for(const linea of lineasIngreso){
            WSIngresos.getRow(filactual).values = [i,linea.descripcion,linea.monto,linea.cantidad,linea.fechaTransaccion,linea.nombreMoneda,linea.descripcionTransaccionTipo,linea.descripcionIngresoTipo];
            filactual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }
}

async function agregarEgresosAExcel(lineasEgreso,WSEgresos,filactual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Costo Real", "Cantidad", "Fecha Registro", "Moneda"];
        let i=1;
        filactual = await excelJSController.agregaHeader(WSEgresos,filactual,header1,headerTitulo,borderStyle);
        for(const linea of lineasEgreso){
            WSEgresos.getRow(filactual).values = [i,linea.descripcion,linea.costoReal,linea.cantidad,linea.fechaRegistro,linea.nombreMoneda];
            filactual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }

}

async function agregarEstimacionesCostoAExcel(lineasEstimacionCosto,WSEstimacionCosto,filactual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Tarifa Unitaria", "Cantidad Recurso","Subtotal", "Fecha Inicio", "Moneda", "Tiempo Requerido"];
        let i=1;
        filactual = await excelJSController.agregaHeader(WSEstimacionCosto,filactual,header1,headerTitulo,borderStyle);
        for(const linea of lineasEstimacionCosto){
            WSEstimacionCosto.getRow(filactual).values = [i,linea.descripcion,linea.tarifaUnitaria,linea.cantidadRecurso,linea.subtotal,linea.fechaInicio,linea.nombreMoneda,linea.tiempoRequerido];
            filactual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }
}

async function subirJSON(req, res, next) {
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

async function obtenerJSON(req,res,next){
    const {fileId} = req.params;
    console.log(fileId);
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
    subirJSON,
    descargarExcel,
    obtenerJSON
}