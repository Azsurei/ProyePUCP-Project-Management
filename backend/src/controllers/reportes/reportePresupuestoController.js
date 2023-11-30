const connection = require("../../config/db");
const XLSX = require('xlsx');
const Exceljs = require('exceljs');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const excelJSController = require("../xlxs/excelJSController");
const fileController = require("../files/fileController");
const presupuestoController = require("../presupuesto/presupuestoController");
const ingresoController = require("../presupuesto/ingresoController");
const egresoController = require("../presupuesto/egresoController");
const tipoIngresoController = require("../presupuesto/tipoIngresoController");
const estimacionCostoController = require("../presupuesto/estimacionCostoController");
const monedaController = require("../presupuesto/monedaController");
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
        
        //Con el id del archivo vamos a descargar el JSON
        //Pasamos ese JSON a la funcion de generar excel y este nos va a devolver el workbook
        workbook = await generarExcelPresupuesto(jsonData);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `Tareas.xlsx`);

        // Borrar en produccion
        const excelFilePath = path.join(destinationFolder, `Presupuesto.xlsx`);
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
    try{
        const url = await fileController.getArchivo(idArchivo);
        let filename = `${idArchivo}.json`;
        const destinationFolder = path.join(__dirname, '../../tmp');
        let fullPath = path.join(destinationFolder, filename);
        
        await fileController.descargarDesdeURL(url,fullPath);
        
        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const presupuesto = JSON.parse(fileContent);
        fs.unlinkSync(fullPath);
        //Lo devolvemos
        res.status(200).json({
            presupuesto,
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



async function crearExcelCajaEgresos(req,res,next){
    const {idPresupuesto,fechaIni,fechaFin} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');
    try {
        const presupuesto = await presupuestoController.obtenerPresupuestoFlujoCajaEgreso(idPresupuesto,fechaIni,fechaFin);
        
        const fechaCreacion = new Date(presupuesto.general.fechaCreacion);
        const mesActual = fechaCreacion.getUTCMonth() + 1;
        const monedas = await monedaController.funcListarTodas();
        const lineasIngresoOrdenadas = await ingresoController.ordenarLineasIngreso(presupuesto.lineasIngreso,mesActual,presupuesto.general.cantidadMeses,presupuesto.general.idMoneda,monedas);
        const lineasEgresoOrdenadas = await egresoController.ordenarLineasEgreso(presupuesto.lineasEgreso,mesActual,presupuesto.general.cantidadMeses,presupuesto.general.idMoneda,monedas);
        const mesesMostrados = meses.slice(mesActual - 1, mesActual - 1 + presupuesto.general.cantMeses);
        
        workbook = await funcCrearExcelCajaEgresos(presupuesto,lineasEgresoOrdenadas,lineasIngresoOrdenadas);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `tareas.xlsx`);
        await workbook.xlsx.writeFile(path.join(destinationFolder, `ExcelCaja.xlsx`));
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log(`Excel caja de egresos enviado`);
        res.end();
    } catch (error) {
        next(error);
    }
}


async function funcCrearExcelCajaEgresos(presupuesto,lineasEgresoOrdenadas,lineasIngresoOrdenadas){
    try {
        let filaActual=1;
        const workbook = new Exceljs.Workbook();
        const WSCaja = workbook.addWorksheet('Caja');
        // Crear header
        let totalIngresos = 0;
        let totalEgresos = 0;
        filaActual = await agregarHeaderMeses(WSCaja,filaActual,presupuesto.general.cantidadMeses);
        // Imprimir Ingresos
        [filaActual, totalIngresos] = await agregarIngresosAExcelCaja(lineasIngresoOrdenadas,WSCaja,filaActual,presupuesto.general.cantidadMeses);
        //ImprimirEgresos
        [filaActual, totalEgresos] = await agregarEgresosAExcelCaja(lineasEgresoOrdenadas,WSCaja,filaActual,presupuesto.general.cantidadMeses);
        
        //Imprimir acumulado
        let resultados = new Array(presupuesto.general.cantidadMeses+1).fill(0);
        resultados[0] = "Acumulado";
        for(let i=1;i<=presupuesto.general.cantidadMeses;i++){
            resultados[i] = totalIngresos[i-1]-totalEgresos[i-1];
        }
        WSCaja.getRow(filaActual).values = resultados;
        const fila = WSCaja.getRow(filaActual);
        let cantidadMeses = presupuesto.general.cantidadMeses;
        cantidadMeses++;
        for (let col = 2; col <= cantidadMeses; col++) {
            fila.getCell(col).style = {...headerTitulo, border: borderStyle};
        }
        filaActual++;

        excelJSController.ajustarAnchoColumnas(WSCaja);
        return workbook;
    } catch (error) {
        console.log(error);    
    }
}

async function agregarHeaderMeses(WSCaja,filaActual,cantidadMeses){
    try{
        const fila = WSCaja.getRow(filaActual);
        for (let col = 2; col <= cantidadMeses+1; col++) {
            fila.getCell(col).value = `Mes ${col-1}`;
        }
        filaActual++;
    }catch(error){
        console.log(error);
    }
    return filaActual;
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
        const fila = WSCaja.getRow(filaActual);
        cantidadMeses++;
        for (let col = 2; col <= cantidadMeses; col++) {
            fila.getCell(col).style = {...headerTitulo, border: borderStyle};
        }
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
        const fila = WSCaja.getRow(filaActual);
        cantidadMeses++;
        for (let col = 2; col <= cantidadMeses; col++) {
            fila.getCell(col).style = {...headerTitulo, border: borderStyle};
        }
        filaActual++;

        return [filaActual, sumasPorMes];
    } catch (error) {
        console.log(error);
    }
}

async function crearExcelEstimacionCosto(req,res,next){
    const {idPresupuesto} = req.body;

    try {
        const destinationFolder = path.join(__dirname, '../../tmp');
        const lineasEstimacionCosto = await estimacionCostoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const general = await presupuestoController.funcListarXIdPresupuesto(idPresupuesto);
        const presupuesto = {
            general,
            lineasEstimacionCosto
        }
        
        workbook = await funcCrearExcelEstimacionCosto(presupuesto);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `tareas.xlsx`);
        await workbook.xlsx.writeFile(path.join(destinationFolder, `EstimacionCosto.xlsx`));
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log(`Excel de estimacion de costo enviado`);
        res.end();
    } catch (error) {
        next(error);
    }
}

async function funcCrearExcelEstimacionCosto(presupuesto){
    try {

        let filaActual=1;
        const workbook = new Exceljs.Workbook();
        const WSEstimaciones = workbook.addWorksheet('Estimacion de costos');

        const header1 = ["Partida","Cantidad de recurso","Tarifa","Tiempo requerido","Subtotal"];
        filaActual = await excelJSController.agregaHeader(WSEstimaciones,filaActual,header1,headerTitulo,borderStyle);

        filaActual = await agregarEstimacionCostoAExcel(presupuesto,WSEstimaciones,filaActual);

        excelJSController.ajustarAnchoColumnas(WSEstimaciones);
        return workbook;
    } catch (error) {
        console.log(error);    
    }

}

async function agregarEstimacionCostoAExcel(presupuesto,WSEstimaciones,filaActual){
    const monedas = await monedaController.funcListarTodas();
    try{
        let totalEstimacion = 0;
        for(const linea of presupuesto.lineasEstimacionCosto){
            if(linea.idMoneda!=presupuesto.general.idMoneda){
                const cambioMoneda = monedas[linea.idMoneda-1].tipoCambio;
                linea.tarifaUnitariia = cambioMoneda*linea.tarifaUnitaria;
                linea.subtotal = cambioMoneda*linea.subtotal;
            }
            WSEstimaciones.getRow(filaActual).values = [linea.descripcion,linea.cantidadRecurso,linea.tarifaUnitaria,linea.tiempoRequerido,linea.subtotal];
            filaActual++;
            totalEstimacion+=linea.subtotal;
        }

        filaActual = await agregarResumenEstimacionCostoAExcel(presupuesto.general,WSEstimaciones,filaActual,totalEstimacion);
    }catch(error){
        console.log(error);
    }
    return filaActual;
}

async function agregarResumenEstimacionCostoAExcel(general,WSEstimaciones,filaActual,totalEstimacion){
    try{
        filaActual++;
        let celdaEscogida;
        const total = [null,null,null,"TOTAL",totalEstimacion];
        WSEstimaciones.getRow(filaActual).values = total;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const reservaContingencia = [null,null,null,"Reserva de contingencia",general.reservaContingencia];
        WSEstimaciones.getRow(filaActual).values = reservaContingencia;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        
        filaActual++;

        const lineaBaseDeCostos = [null,null,null,"Linea Base de Costos",totalEstimacion+general.reservaContingencia];
        WSEstimaciones.getRow(filaActual).values = lineaBaseDeCostos;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const reservaGestion = [null,null,null,"Reserva de gestion",(totalEstimacion+general.reservaContingencia)*general.porcentajeReservaGestion,`${general.porcentajeReservaGestion*100}%`];
        WSEstimaciones.getRow(filaActual).values = reservaGestion;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const presupuesto = [null,null,null,"Presupuesto",general.presupuestoInicial];
        WSEstimaciones.getRow(filaActual).values = presupuesto;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const ganancia = [null,null,null,"Ganancia",general.presupuestoInicial*general.porcentajeGanancia,`${general.porcentajeGanancia*100}%`];
        WSEstimaciones.getRow(filaActual).values = ganancia;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        let totGanancia = totalEstimacion+general.reservaContingencia+general.presupuestoInicial;
        const totalConGanancia = [null,null,null,"Total con ganancia",totGanancia];
        WSEstimaciones.getRow(filaActual).values = totalConGanancia;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const IGV = [null,null,null,"IGV",totGanancia*general.IGV,`${general.IGV*100}%`];
        WSEstimaciones.getRow(filaActual).values = IGV;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

        const totalFinal = [null,null,null,"Total",totalEstimacion+general.reservaContingencia+general.presupuestoInicial+general.IGV];
        WSEstimaciones.getRow(filaActual).values = totalFinal;
        celdaEscogida = WSEstimaciones.getCell(filaActual,5);
        celdaEscogida.style = {...headerTitulo, border: borderStyle};
        filaActual++;

    }catch(error){
        console.log(error);
    }
    return filaActual;
}

async function crearExcelCajaEstimacion(req,res,next){
    try {
        const {idPresupuesto} = req.body;
        const destinationFolder = path.join(__dirname, '../../tmp');
        const general = await presupuestoController.funcListarXIdPresupuesto(idPresupuesto);
        const lineasIngreso = await ingresoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const lineasEstimacionCosto = await estimacionCostoController.funcListarLineasXIdPresupuesto(idPresupuesto);
        const fechaCreacion = new Date(general.fechaCreacion);
        const mesActual = fechaCreacion.getUTCMonth() + 1;
        const monedas = await monedaController.funcListarTodas();
        const lineasIngresoOrdenadas = await ingresoController.ordenarLineasIngreso(lineasIngreso,mesActual,general.cantidadMeses,general.idMoneda,monedas);
        const lineasEstimacionCostoOrdenadas = await estimacionCostoController.ordenarLineasEstimacionCosto(lineasEstimacionCosto,mesActual,general.cantidadMeses,general.idMoneda,monedas);
    
        workbook = await funcCrearExcelCajaEstimacion(general,lineasIngresoOrdenadas,lineasEstimacionCostoOrdenadas);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `ExcelCajaEstimacion.xlsx`);
        await workbook.xlsx.writeFile(path.join(destinationFolder, `ExcelCajaEstimacion.xlsx`));
        // Enviar el archivo
        await workbook.xlsx.write(res);
        console.log(`Excel caja de estimacion de costo enviado`);
        res.end();
    } catch (error) {
        next(error);
    }
}

async function funcCrearExcelCajaEstimacion(general,lineasIngresoOrdenadas,lineasEstimacionCostoOrdenadas){
    try{
        let filaActual=1;
        const workbook = new Exceljs.Workbook();
        const WSCaja = workbook.addWorksheet('Caja Estimacion de Costos');
        let totalIngresos = 0;
        let totalEstimacion = 0;
        //console.log(lineasEstimacionCostoOrdenadas);
        filaActual = await agregarHeaderMeses(WSCaja,filaActual,general.cantidadMeses);
        // Imprimir Ingresos
        [filaActual, totalIngresos] = await agregarIngresosAExcelCaja(lineasIngresoOrdenadas,WSCaja,filaActual,general.cantidadMeses);
        [filaActual, totalEstimacion] = await agregarEstimacionesAExcelCaja(lineasEstimacionCostoOrdenadas,WSCaja,filaActual,general.cantidadMeses);
    
        let resultados = new Array(general.cantidadMeses+1).fill(0);
        resultados[0] = "Acumulado";
        for(let i=1;i<=general.cantidadMeses;i++){
            resultados[i] = totalIngresos[i-1]-totalEstimacion[i-1];
        }
        WSCaja.getRow(filaActual).values = resultados;
        const fila = WSCaja.getRow(filaActual);
        let cantidadMeses = general.cantidadMeses;
        cantidadMeses++;
        for (let col = 2; col <= cantidadMeses; col++) {
            fila.getCell(col).style = {...headerTitulo, border: borderStyle};
        }
        filaActual++;

        excelJSController.ajustarAnchoColumnas(WSCaja);
        return workbook;
    }catch(error){
        console.log(error);
    }
}

async function agregarEstimacionesAExcelCaja(lineasEstimacionCostoOrdenadas, WSCaja, filaActual,cantidadMeses) {
    try {

        let i = 0;
        let sumasPorMes = new Array(cantidadMeses).fill(0); // Inicializa el array para las sumas por mes

        WSCaja.getRow(filaActual).values = ["Estimacion (*)"];
        filaActual++;
        console.log(lineasEstimacionCostoOrdenadas);
        for(const lineaMes of lineasEstimacionCostoOrdenadas){
            let filaArray = lineaMes;
            WSCaja.getRow(filaActual).values = filaArray;

            // Sumar los ingresos de cada mes a sumasPorMes
            lineaMes.forEach((subtotal, mesIndex) => {
                if(mesIndex!=0){
                    sumasPorMes[mesIndex-1] += subtotal;
                }
            });
            i++;
            filaActual++;
        }

        WSCaja.getRow(filaActual).values = ["Total Estimaciones", ...sumasPorMes];
        const fila = WSCaja.getRow(filaActual);
        cantidadMeses++;
        for (let col = 2; col <= cantidadMeses; col++) {
            fila.getCell(col).style = {...headerTitulo, border: borderStyle};
        }
        filaActual++;

        return [filaActual, sumasPorMes];
    } catch (error) {
        console.error(error);
    }

}

module.exports = {
    subirJSON,
    descargarExcel,
    obtenerJSON,
    crearExcelCajaEgresos,
    crearExcelCajaEstimacion,
    crearExcelEstimacionCosto
}