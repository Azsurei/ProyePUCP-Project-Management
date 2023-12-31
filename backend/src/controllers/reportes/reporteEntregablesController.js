const connection = require("../../config/db");

const authGoogle = require("../authGoogle/authGoogle");
const fs = require('fs');
const fsp = require('fs').promises
const path = require('path');
const https = require('https');
const excelJSController = require("../xlxs/excelJSController");
const fileController = require('../files/fileController');
const Exceljs = require('exceljs');
const dateController = require('../dateController');
const headerTitulo = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD8D8D8' } // Usa un color en formato ARGB
    }
};

const headerNaranja = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFABF8F' } // Usa un color en formato ARGB
    }
};

const headerVerde = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD6E3BC' } // Usa un color en formato ARGB
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




async function traerInfoReporteEntregables(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        const entregables = results[0];

        console.log("Entregables listados con exito ");

        const query2 = `CALL LISTAR_TAREAS_X_ID_ENTREGABLE(?);`;
        for (const entregable of entregables) {
            const [results2] = await connection.query(query2, [
                entregable.idEntregable,
            ]);
            const tareasEntregable = results2[0];

            for (const tarea of tareasEntregable) {
                if (tarea.idEquipo !== null) {

                    const query4 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                    const [equipo] = await connection.query(query4, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo = equipo[0][0]; //solo consideramos que una tarea es asignada a un subequipo

                    //listamos los participantes de dicho equipo
                    const query5 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
                    const [participantes] = await connection.query(query5, [
                        tarea.idEquipo,
                    ]);
                    tarea.equipo.participantes = participantes[0];
                    tarea.usuarios = [];
                } else {

                    const query6 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                    const [usuarios] = await connection.query(query6, [
                        tarea.idTarea,
                    ]);
                    if (usuarios != null) {
                        tarea.usuarios = usuarios[0];
                    }
                    tarea.equipo = null;
                    
                }
            }

            entregable.tareasEntregable = tareasEntregable;
        }

        res.status(200).json({
            entregables,
            message: "Se listaron los entregables con exito",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function descargarExcel(req, res, next) {
    const {idArchivo} = req.body;
    const destinationFolder = path.join(__dirname, '../../tmp');

    try{
        
        const url = await fileController.getArchivo(idArchivo);
        console.log(destinationFolder);

        // Crear el nombre del archivo con el segmento de la URL
        let filename = `${idArchivo}.json`; // Asumiendo que es un archivo JSON

        // Combinar con el destinationFolder para crear la ruta completa
        let fullPath = path.join(destinationFolder, filename);
        console.log(destinationFolder);
        await fileController.descargarDesdeURL(url,fullPath);

        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        //console.log(jsonData);
        workbook = await generarExcelEntregables(jsonData);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `Tareas.xlsx`);
        
        //BORRAR EN PRODUCCION
        excelFilePath = path.join(destinationFolder, `Entregables.xlsx`);
        await workbook.xlsx.writeFile(excelFilePath);

        await workbook.xlsx.write(res);
        res.status(200).end();
    }catch(error){
        console.error("Error al exportar el reporte Excel:", error.message);
        next(error);
    } 
}
async function subirJSON(req, res, next) {
    const { entregables,idProyecto,nombre,idUsuarioCreador } = req.body;
    //console.log(req.body);


    try {
        var tmpFilePath = await generarPathEntregables(entregables,idProyecto);
        const file = fs.readFileSync(tmpFilePath);
        

        const file2Upload ={
            buffer:file,
            mimetype: 'application/json',
            originalname: `${nombre}.json`
        }
        
        console.log(file);
        
        const idArchivo = await fileController.postArchivo(file2Upload);
        console.log(idArchivo);
        
        const query = `CALL INSERTAR_REPORTE_X_PROYECTO(?,?,?,?,?);`;
        const [results] = await connection.query(query, [idProyecto,2,nombre, idArchivo,idUsuarioCreador]);
        const idReporte = results[0][0].idReporte;
        //workbook = generarExcelEntregables(entregables);
        
        
        console.log('Subiendo al S3');

        fs.unlinkSync(tmpFilePath);
        res.status(200).json({
            idReporte: idReporte,
            entregables,
            fileId: idArchivo,
            message: "Se genero el reporte de entregables con exito",
        });
    } catch (error) {
        next(error);
    }
}

async function obtenerJSON(req, res, next) {
    const {idArchivo} = req.params;

    try{
        const url = await fileController.getArchivo(idArchivo);
        let filename = `${idArchivo}.json`;
        const destinationFolder = path.join(__dirname, '../../tmp');
        let fullPath = path.join(destinationFolder, filename);
        
        await fileController.descargarDesdeURL(url,fullPath);
        
        const fileContent = await fsp.readFile(fullPath, 'utf8');
        const entregables = JSON.parse(fileContent);
        fs.unlinkSync(fullPath);
        res.status(200).json({
            entregables,
            message: "Detalles del reporte recuperados con éxito"
        });
    }catch(error){
        next(error);
    }   
}

async function generarPathEntregables(presupuesto,idReporte){
    var tmpFilePath;
    console.log(presupuesto);
    try {
        tmpFilePath = `./tmp/entregables-${idReporte}.json`;
        console.log("Path nuevo "+tmpFilePath);
        fs.writeFileSync(tmpFilePath, JSON.stringify(presupuesto));
    } catch (error) {
        console.log(error);
    }
    return tmpFilePath;
}

async function generarExcelEntregables(entregables) {
    try {
        
        const workbook = new Exceljs.Workbook();

        let filaActual;
        let nroEntregable = 1;
        var WSEntregable;
        for(const entregable of entregables){
            filaActual = 1; 
            WSEntregable = workbook.addWorksheet(`Entregable ${nroEntregable}`);
            filaActual++;
            filaActual = await agregarEntregableAExcel(entregable,WSEntregable,filaActual,nroEntregable);
            excelJSController.ajustarAnchoColumnas(WSEntregable);
            nroEntregable++;
        }
        // Escribe el libro de trabajo a un archivo

        console.log("Se generó el reporte de entregables con éxito");
        return workbook;
    } catch (error) {
        console.log(error);
    }
}

async function agregarEntregableAExcel(entregable,WSEntregable,filaActual,nroEntregable){
    try{
        filaActual = await agregarCabecerasAExcelEntregable(entregable,WSEntregable,filaActual,nroEntregable);
        filaActual = await agregarContribuyentesAExcel(entregable.contribuyentes,WSEntregable,filaActual);
        filaActual = await agregarTareasAExcel(entregable.tareasEntregable,WSEntregable,filaActual);
        return filaActual;
    }catch(error){
        console.log(error);
    }
}

async function agregarCabecerasAExcelEntregable(entregable,WSEntregable,filaActual,nroEntregable){
    if(nroEntregable==2){
        console.log("Entregable 2 si llego unu");
    }
    try {
        const header1 = [`Entregable ${nroEntregable}`];
        const header2 = ["Nombre","Fecha Inicio","Fecha Fin"];
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header1,headerNaranja,borderStyle);
        WSEntregable.mergeCells(filaActual-1, 1, filaActual-1, 5);
        const mergedCell = WSEntregable.getCell(filaActual-1, 1);
        mergedCell.style = {
            ...mergedCell.style, // Mantén los estilos previos
            alignment: alignmentCenterStyle
        };
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header2,headerTitulo,borderStyle);
        entregable.fechaInicio = await dateController.formatearFecha2D_MM_YYYY(entregable.fechaInicio);
        entregable.fechaFin = await dateController.formatearFecha2D_MM_YYYY(entregable.fechaFin);

        WSEntregable.getRow(filaActual).values = [ entregable.nombre,entregable.fechaInicio,entregable.fechaFin];
        filaActual +=2;
    
        const header3 = ["ComponenteEDT","Descripcion","Hito asociado"];
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header3,headerTitulo,borderStyle);
        WSEntregable.getRow(filaActual).values = [ entregable.ComponenteEDTNombre,entregable.descripcion,entregable.hito];
        filaActual +=2;
    
        const header4 = ["Progreso",`${entregable.barProgress} %`];
        WSEntregable.getRow(filaActual).values = header4;
        let celdaProgreso = WSEntregable.getCell(filaActual,1);
        celdaProgreso.style = {...headerVerde, border: borderStyle};
        filaActual +=2;
    
        return filaActual;
    } catch (error) {
        console.log(error);
    }
}

async function agregarContribuyentesAExcel(contribuyentes,WSEntregable,filaActual){
    try {
        const header1 = ["Contribuyentes"];
        const header2 = ["Nombre","Apellidos","Correo","Porcentaje estimado"];
        let hayEquipo = true;
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header1,headerVerde,borderStyle);
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header2,headerTitulo,borderStyle);
        
        for(const contribuyente of contribuyentes){
            if(contribuyente.usuario!=null){
                WSEntregable.getRow(filaActual).values = [ contribuyente.usuario.nombres,contribuyente.usuario.apellidos,contribuyente.usuario.correoElectronico,contribuyente.porcentajeTotal];
                filaActual++;
            }

            if(contribuyente.equipo!=null){
                
                if(hayEquipo){
                    filaActual++;
                    const header3 = ["Equipo"];
                    const header4 = ["Nombre"];
                    filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header3,headerTitulo,borderStyle);
                    filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header4,headerTitulo,borderStyle);
                    hayEquipo = false;
                }
                filaActual = await agregarEquipoAExcel(contribuyente.equipo,WSEntregable,filaActual);
            }
        }

        filaActual ++;

        return filaActual;  
    } catch (error) {
        console.log(error);
    }
}


async function agregarTareasAExcel(tareasEntregable,WSEntregable,filaActual){
    try {
        let nroTarea = 1;
        let hayEquipo = false;
        
        const header1 = [`Tarea`];
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header1,headerVerde,borderStyle);
        const header2 = ["Sumilla","Descripcion","Fecha Inicio","Fecha Fin","Estado"];
        filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header2,headerTitulo,borderStyle);

        for(const tarea of tareasEntregable){
            tarea.fechaInicio = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaInicio);
            tarea.fechaFin = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaFin);
            WSEntregable.getRow(filaActual).values = [ tarea.sumillaTarea,tarea.descripcion,tarea.fechaInicio,tarea.fechaFin,tarea.nombreTareaEstado];
            filaActual++;
    
            /*if(tarea.equipo != null && tarea.equipo.length>0){
                hayEquipo = true;
                if(hayEquipo){
                    const header3 = ["Equipo"];
                    const header4 = ["Nombre"];
                    filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header3,headerTitulo,borderStyle);
                    filaActual = await excelJSController.agregaHeader(WSEntregable,filaActual,header4,headerTitulo,borderStyle);
                }
                filaActual = await agregarEquipoAExcel(tarea.equipo,WSEntregable,filaActual);
            }*/
            
            /*
            if(tarea.usuarios!=null && tarea.usuarios.length>0){
                filaActual = await agregarUsuariosAExcel(tarea.usuarios,WSEntregable,filaActual);
            }
            x*/
            
            nroTarea++;
        }
    
        filaActual ++;
        return filaActual;
    } catch (error) {
        console.log(error);
    }
}

async function agregarEquipoAExcel(equipo,WSEntregable,filaActual){
    try {
        //console.log(equipo);
        
        WSEntregable.getRow(filaActual).values = [ equipo.nombre];
        filaActual++;
        return filaActual;
    } catch (error) {
        console.log(error);
    }
}

async function agregarUsuariosAExcel(usuarios, WSEntregable, filaActual) {
    try {
        const header1 = ["Usuarios"];
        const header2 = ["Nombre", "Apellidos", "Correo"];

        // Agrega el primer encabezado
        filaActual = await excelJSController.agregaHeader(WSEntregable, filaActual, header1, headerTitulo, borderStyle);

        // Combinar las celdas para el encabezado "Usuarios"
        WSEntregable.mergeCells(filaActual-1, 1, filaActual-1, 3);
        const mergedCell = WSEntregable.getCell(filaActual-1, 1);
        mergedCell.style = {
            ...mergedCell.style, // Mantén los estilos previos
            alignment: alignmentCenterStyle
        };

        // Agrega el segundo encabezado
        filaActual = await excelJSController.agregaHeader(WSEntregable, filaActual, header2, headerTitulo, borderStyle);

        // Agrega los datos de los usuarios
        for (const usuario of usuarios) {
            WSEntregable.getRow(filaActual).values = [usuario.nombres, usuario.apellidos, usuario.correoElectronico];
            filaActual++;
        }
        filaActual++;
        return filaActual;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    subirJSON,
    descargarExcel,
    obtenerJSON,
    traerInfoReporteEntregables
};
