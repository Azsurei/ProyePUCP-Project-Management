const connection = require("../../config/db");
const XLSX = require('xlsx');
const Exceljs = require('exceljs');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const xlsxController = require("../xlxs/xlxsController");
const authGoogle = require("../authGoogle/authGoogle");
const excelJSController = require("../xlxs/excelJSController");
const fileController = require("../files/fileController");
const presupuestoController = require("../presupuesto/presupuestoController");
const ingresoController = require("../presupuesto/ingresoController");
const egresoController = require("../presupuesto/egresoController");
const tipoIngresoController = require("../presupuesto/tipoIngresoController");
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

const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre'
  ];
  


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

async function descargarExcel(req,res,next){
    const {idArchivo} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        const url = await fileController.getArchivo(idArchivo);
        //console.log(destinationFolder);

        // Crear el nombre del archivo con el segmento de la URL
        let filename = `${idArchivo}.json`; // Asumiendo que es un archivo JSON

        // Combinar con el destinationFolder para crear la ruta completa
        let fullPath = path.join(destinationFolder, filename);
        console.log(destinationFolder);
        await fileController.descargarDesdeURL(url,fullPath);
        
        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const excelFilePath = path.join(destinationFolder, `${idArchivo}.xlsx`);
        console.log(excelFilePath);
        
        //Con el id del archivo vamos a descargar el JSON
        //Pasamos ese JSON a la funcion de generar excel y este nos va a devolver el workbook
        workbook = await generarExcelPresupuesto(jsonData);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `Tareas.xlsx`);

        // Borrar en produccion
        excelFilePath = path.join(destinationFolder, `Presupuesto.xlsx`);
        await workbook.xlsx.writeFile(excelFilePath);

        await workbook.xlsx.write(res);
        //Vamos a devolver ese workbook a front
        console.log("Se ha enviado el archivo excel EDT");
        res.end();
    }catch(error){
        console.error("Error al exportar el reporte Excel:", error.message);
        next(error);
    }
}

async function generarExcelPresupuesto(presupuesto){

    try{
        const workbook = new Exceljs.Workbook();
        let filaActual=1;

        const WSGeneral = workbook.addWorksheet('General');
        await agregarInformacionGeneralAExcel(presupuesto.general,WSGeneral,filaActual);

        if(presupuesto.lineasPresupuesto.lineasIngreso!=null){
            console.log('Llegue');
            const WSIngresos = workbook.addWorksheet('Ingresos');
            await agregarIngresosAExcel(presupuesto.lineasPresupuesto.lineasIngreso,WSIngresos,filaActual);
            excelJSController.ajustarAnchoColumnas(WSIngresos);
        }
        
        if(presupuesto.lineasPresupuesto.lineasEgreso!=null){
            const WSEgresos = workbook.addWorksheet('Egresos');
            await agregarEgresosAExcel(presupuesto.lineasPresupuesto.lineasEgreso,WSEgresos,filaActual);
            excelJSController.ajustarAnchoColumnas(WSEgresos);
        }

        if(presupuesto.lineasPresupuesto.lineasEstimacionCosto!=null){
            const WSEstimacionCosto = workbook.addWorksheet('Estimaciones');
            await agregarEstimacionesCostoAExcel(presupuesto.lineasPresupuesto.lineasEstimacionCosto,WSEstimacionCosto,filaActual);
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

async function agregarIngresosAExcel(lineasIngreso,WSIngresos,filaActual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Monto", "Cantidad", "Fecha Transaccion", "Moneda", "Tipo Transaccion", "Tipo Ingreso"];
        let i=1;
        filaActual = await excelJSController.agregaHeader(WSIngresos,filaActual,header1,headerTitulo,borderStyle);
        for(const linea of lineasIngreso){
            WSIngresos.getRow(filaActual).values = [i,linea.descripcion,linea.monto,linea.cantidad,linea.fechaTransaccion,linea.nombreMoneda,linea.descripcionTransaccionTipo,linea.descripcionIngresoTipo];
            filaActual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }
}

async function agregarEgresosAExcel(lineasEgreso,WSEgresos,filaActual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Costo Real", "Cantidad", "Fecha Registro", "Moneda"];
        let i=1;
        filaActual = await excelJSController.agregaHeader(WSEgresos,filaActual,header1,headerTitulo,borderStyle);
        for(const linea of lineasEgreso){
            WSEgresos.getRow(filaActual).values = [i,linea.descripcion,linea.costoReal,linea.cantidad,linea.fechaRegistro,linea.nombreMoneda];
            filaActual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }

}

async function agregarEstimacionesCostoAExcel(lineasEstimacionCosto,WSEstimacionCosto,filaActual){
    try{
        const header1 = ["Nro Linea", "Descripcion", "Tarifa Unitaria", "Cantidad Recurso","Subtotal", "Fecha Inicio", "Moneda", "Tiempo Requerido"];
        let i=1;
        filaActual = await excelJSController.agregaHeader(WSEstimacionCosto,filaActual,header1,headerTitulo,borderStyle);
        for(const linea of lineasEstimacionCosto){
            WSEstimacionCosto.getRow(filaActual).values = [i,linea.descripcion,linea.tarifaUnitaria,linea.cantidadRecurso,linea.subtotal,linea.fechaInicio,linea.nombreMoneda,linea.tiempoRequerido];
            filaActual++;
            i++;
        }
    }catch(error){
        console.log(error);
    }
}

async function subirJSON(req, res, next) {
    const {idProyecto,nombre,presupuesto,idUsuarioCreador} = req.body;
    
    try {
        
        console.log("Hola servidor");
        //let workbook = await probandoExcelPresupuesto(presupuesto);
        //Generamos el path temporal
        var tmpFilePath = generarPathPresupuesto(presupuesto,idProyecto);

        //Escribir el archivo en el path temporal
        const file = fs.readFileSync(tmpFilePath);
        
        const file2Upload = {
            buffer:file,
            mimetype: 'application/json',
            originalname: `${nombre}.json`
        }
        //Subir el archivo del path temporal a internet en este caso S3
        const idArchivo = await fileController.postArchivo(file2Upload);

        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,13,nombre,idArchivo,idUsuarioCreador]);
        const idReporte = results[0][0].idReporte;

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
    const {idArchivo} = req.params;
    console.log(idArchivo);
    try{
        //Descargamos de la S3 el archivo del JSON y lo leemos y lo parseamos a JSON
        const jsonData = await fileController.funcGetJSONFile(idArchivo)
        console.log(jsonData);
        //Lo devolvemos
        res.status(200).json({
            jsonData,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    } 
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



async function crearExcelCaja(req,res,next){
    const {idPresupuesto,fechaIni,fechaFin} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');
    try {
        const presupuesto = await presupuestoController.obtenerPresupuestoFlujoCaja(idPresupuesto,fechaIni,fechaFin);
        
        const fechaCreacion = new Date(presupuesto.general.fechaCreacion);
        const mesActual = fechaCreacion.getUTCMonth() + 1;
        const lineasIngresoOrdenadas = await ingresoController.ordenarLineasIngreso(presupuesto.lineasIngreso,mesActual,presupuesto.general.cantidadMeses);
        const lineasEgresoOrdenadas = await egresoController.ordenarLineasEgreso(presupuesto.lineasEgreso,mesActual,presupuesto.general.cantidadMeses);
        const mesesMostrados = meses.slice(mesActual - 1, mesActual - 1 + presupuesto.general.cantMeses);
        
        workbook = await funcCrearExcelCaja(presupuesto,lineasEgresoOrdenadas,lineasIngresoOrdenadas);
        const excelFilePath = path.join(destinationFolder, `${idPresupuesto}.xlsx`);
        await workbook.xlsx.writeFile(excelFilePath);
        console.log(`Se creo el archivo ${excelFilePath}`);
        res.download(excelFilePath , `${idPresupuesto}.xlxs`, async(err) => {
            try {
                // Eliminar el archivo temporal de forma asíncrona
                //await fsp.unlink(excelFilePath);
            } catch (e) {
                console.error("Error al eliminar el archivo temporal:", e.message);
            }
            if (err) {
                next(err);
            }
        });
    } catch (error) {
        next(error);
    }
}


async function funcCrearExcelCaja(presupuesto,lineasEgresoOrdenadas,lineasIngresoOrdenadas){
    try {

        let filaActual=1;
        const workbook = new Exceljs.Workbook();
        const WSCaja = workbook.addWorksheet('Caja');
        // Crear header
        let totalIngresos = 0;
        let totalEgresos = 0;
        // Imprimir Ingresos
        [filaActual, totalIngresos] = await agregarIngresosAExcelCaja(lineasIngresoOrdenadas,WSCaja,filaActual,presupuesto.general.cantidadMeses);
        //ImprimirEgresos
        [filaActual, totalEgresos] = await agregarEgresosAExcelCaja(lineasEgresoOrdenadas,WSCaja,filaActual,presupuesto.general.cantidadMeses);
        //Imprimir acumulado
        WSCaja.getRow(filaActual).values = ["Acumulado",totalIngresos-totalEgresos];
        let celdaAcumulado = WSCaja.getCell(filaActual,1);
        celdaAcumulado.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        excelJSController.ajustarAnchoColumnas(WSCaja);
        return workbook;
    } catch (error) {
        console.log(error);    
    }
}

async function agregarIngresosAExcelCaja(lineasIngresoOrdenadas, WSCaja, filaActual,cantidadMeses) {
    try {

        let i = 0;
        let sumasPorMes = new Array(cantidadMeses).fill(0); // Inicializa el array para las sumas por mes
    
        WSCaja.getRow(filaActual).values = ["Ingresos(*)"];
        filaActual++;
        
        const tiposIngreso = await tipoIngresoController.funcListarTodos();
        
        for(const lineaMes of lineasIngresoOrdenadas){
            let filaArray = [tiposIngreso[i].descripcion]; // Asume que quieres etiquetar cada fila con "Tipo n"
            filaArray.push(...lineaMes);
            WSCaja.getRow(filaActual).values = filaArray;

            // Sumar los ingresos de cada mes a sumasPorMes
            lineaMes.forEach((monto, mesIndex) => {
                sumasPorMes[mesIndex] += monto;
            });
            i++;
            filaActual++;
        }
    
        WSCaja.getRow(filaActual).values = ["Total Ingresos", ...sumasPorMes];
        let celdaTotalIngresos = WSCaja.getCell(filaActual, 1);
        celdaTotalIngresos.style = {...headerTitulo, border: borderStyle};
        filaActual++;
    
        return [filaActual, sumasPorMes]; // Retornar también el array de sumas por mes
    } catch (error) {
        console.error(error);
    }
}

async function agregarEgresosAExcelCaja(lineasEgresoOrdenadas, WSCaja, filaActual,cantidadMeses) {
    try {
        let i = 0;
        let sumasPorMes = new Array(cantidadMeses).fill(0); // Inicializa el array para las sumas por mes

        WSCaja.getRow(filaActual).values = ["Egresos(*)"];
        filaActual++;
        
        for(const lineaMes of lineasEgresoOrdenadas){
            let filaArray = lineaMes;
            WSCaja.getRow(filaActual).values = filaArray;

            // Sumar los ingresos de cada mes a sumasPorMes
            lineaMes.forEach((costoReal, mesIndex) => {
                if(mesIndex!=0){
                    sumasPorMes[mesIndex-1] += costoReal;
                }
            });
            i++;
            filaActual++;
        }

        WSCaja.getRow(filaActual).values = ["Total Egresos", ...sumasPorMes];
        let celdaTotalEgresos = WSCaja.getCell(filaActual,1);
        celdaTotalEgresos.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        return [filaActual, sumasPorMes];
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    subirJSON,
    descargarExcel,
    obtenerJSON,
    crearExcelCaja
}