const fs = require('fs');
const fsp = require('fs').promises;
const fileController = require("../files/fileController");
const path = require('path');
const Exceljs = require('exceljs');
const excelJSController = require("../xlxs/excelJSController");
const dateController = require("../dateController");
const connection = require("../../config/db");


const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9CB9C' } // Usa un color en formato ARGB
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


async function subirJSON(req,res,next){
    try {
        const {tareas,idProyecto,nombre,idUsuarioCreador} = req.body;
        var tmpFilePath = await generarPathTareas(tareas,idProyecto);
        
        const file = fs.readFileSync(tmpFilePath);
        //let filename = `${idArchivo}.json`;

        const file2Upload = {
            buffer:file,
            mimetype: 'application/json',
            originalname: `${nombre}.json`
        }

        const idArchivo = await fileController.postArchivo(file2Upload);

        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,4,nombre,idArchivo,idUsuarioCreador]);
        const idReporte = results[0][0].idReporte;
        
        fs.unlinkSync(tmpFilePath);
        console.log(`Se creo el reporte de tareas ${idReporte}`);
        res.status(200).json({
            tareas,
            message: "Se genero el reporte de tareas con exito",
        });
    } catch (error) {
        next(error);
    }
}


async function generarPathTareas(tareas,idProyecto){
    var tmpFilePath;
    try {
        tmpFilePath = `./tmp/tareas-${idProyecto}.json`;
        console.log("Path nuevo "+tmpFilePath);
        fs.writeFileSync(tmpFilePath, JSON.stringify(tareas));
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}

async function obtenerJSON(req,res,next){
    try {
        const {idArchivo} = req.params;
        const url = await fileController.getArchivo(idArchivo);

        let filename = `${idArchivo}.json`;
        const destinationFolder = path.join(__dirname, '../../tmp');
        let fullPath = path.join(destinationFolder, filename);
        
        await fileController.descargarDesdeURL(url,fullPath);
        
        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const tareas = JSON.parse(fileContent);
        fs.unlinkSync(fullPath);
        console.log(`Se obtuvo el reporte de tareas ${idArchivo}`);
        res.status(200).json({
            tareas,
            message: "Detalles del reporte de tareas recuperado con éxito"
        });
    } catch (error) {
        next(error);
    }
}

async function descargarExcel(req,res,next){
    try {
        const {idArchivo} = req.body;
        const destinationFolder = path.join(__dirname, '../../tmp');
        const url = await fileController.getArchivo(idArchivo);
        //console.log(destinationFolder);

        // Crear el nombre del archivo con el segmento de la URL
        let filename = `${idArchivo}.json`; // Asumiendo que es un archivo JSON

        // Combinar con el destinationFolder para crear la ruta completa
        let fullPath = path.join(destinationFolder, filename);
        //console.log(destinationFolder);
        await fileController.descargarDesdeURL(url,fullPath);

        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        //console.log(jsonData);
        workbook = await generarExcelTareas(jsonData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `ReporteTareas.xlsx`);
        
        //BORRAR EN PRODUCCION
        excelFilePath = path.join(destinationFolder, `ReporteTareas.xlsx`);
        await workbook.xlsx.writeFile(excelFilePath);

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error("Error al exportar el reporte Excel:", error.message);
        next(error);
    }
}


async  function probarExcelTareas(req,res,next){
    try {
        const {tareas} = req.body;
        const destinationFolder = path.join(__dirname, '../../tmp');
        const filename = `ReporteTareas.xlsx`;
        const fullPath = path.join(destinationFolder, filename);
        const workbook = await generarExcelTareas(tareas);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `ReporteTareas.xlsx`);
        console.log("Se genero el excel");
        await workbook.xlsx.write(res);
        await workbook.xlsx.writeFile(fullPath);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
}
async function generarExcelTareas(tareas){
    try{
        const workbook = new Exceljs.Workbook();
        const WSTareas = workbook.addWorksheet('Tareas');
        let filaActual = 1;
        let nroTarea = 1;
        for (const tarea of tareas) {
            filaActual = await agregarTareaAExcel(tarea, WSTareas, filaActual,`${nroTarea}`,1);
            nroTarea++;
        }
        excelJSController.ajustarAnchoColumnas(WSTareas);
        return workbook;
    }catch(error){ 
        console.log(error);
    }
}

async function agregarTareaAExcel(tarea, WSTareas, filaActual,cadenaTarea,esPadre){
    try {
        const headerTarea = [`Tarea ${cadenaTarea}`];
        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,headerTarea,headerTitulo,borderStyle);
        WSTareas.mergeCells(filaActual-1, 1, filaActual-1, 6);
        const mergedCell = WSTareas.getCell(filaActual-1, 1);
        mergedCell.style = {
            ...mergedCell.style, // Mantén los estilos previos
            alignment: alignmentCenterStyle
        };

        const header = ["Nombre","Descripción","Estado","Progreso total","Fecha Inicio","Fecha Fin"];
        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,header,headerSubtitulo,borderStyle);
        if(tarea.fechaInicio == "0000-00-00"){
            tarea.fechaInicio = "Dependiente";
        }else{
            tarea.fechaInicio = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaInicio);
        }
        
        tarea.fechaFin = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaFin);
        WSTareas.getRow(filaActual).values = [tarea.sumillaTarea,tarea.descripcion,tarea.nombreTareaEstado,`${tarea.porcentajeProgreso}%`,tarea.fechaInicio,tarea.fechaFin];
        filaActual+=2;

        if(esPadre==0){
            filaActual = await agregarProgresoAExcel(tarea,WSTareas,filaActual);
            filaActual++;
        }
        if(tarea.tareasHijas){
            let nroTarea = 1;
            for(const tareaHija of tarea.tareasHijas){
                filaActual = await agregarTareaAExcel(tareaHija,WSTareas,filaActual,`${cadenaTarea}.${nroTarea}`,0);
                nroTarea++;
            }
           
        }
    } catch (error) {
        console.log(error);
    }
    return filaActual;
}

async function agregarProgresoAExcel(tarea,WSTareas,filaActual){
    try{
        if(tarea.usuarios){
            for(const usuario of tarea.usuarios){
                filaActual = await agregarProgresoUsuarioAExcel(usuario,WSTareas,filaActual);
            }
        }else if(tarea.equipo){

        }
        
    }catch(error){
        console.log(error);
    }
    return filaActual;
}

async function agregarProgresoUsuarioAExcel(usuario,WSTareas,filaActual){
    try{
        const header1 = ["Nombre","Apellido","Correo"];
        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,header1,headerSubtitulo,borderStyle);
        WSTareas.getRow(filaActual).values = [usuario.nombres,usuario.apellidos,usuario.correoElectronico];
        filaActual+=2;

        const header2 = ["Descripción","Fecha de registro"];
        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,header2,headerSubtitulo,borderStyle);

        if(usuario.progresoDeUsuario>0){
            
            for(const progreso of usuario.progresoDeUsuario){
                WSTareas.getRow(filaActual).values = [progreso.descripcion,progreso.fechaRegistro];
                filaActual++;
            }
        }else{
            WSTareas.getRow(filaActual).values = ["Sin registros de progreso"];
            //Unimos las celdas
            WSTareas.mergeCells(filaActual, 1, filaActual, 2);
            const mergedCell = WSTareas.getCell(filaActual, 1);
            mergedCell.style = {
                ...mergedCell.style, 
                alignment: alignmentCenterStyle
            };
            filaActual++;
        }
    }catch(error){
        console.log(error);
    }
    return filaActual;

}
module.exports={
    subirJSON,
    obtenerJSON,
    descargarExcel,
    probarExcelTareas
}