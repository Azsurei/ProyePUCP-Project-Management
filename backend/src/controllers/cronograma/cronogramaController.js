const connection = require("../../config/db");
const excelJSController = require("../xlxs/excelJSController");
const ExcelJS = require("exceljs");
const path = require("path");
const dateController = require("../dateController");

const headerTitulo = {
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


async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL INSERTAR_CRONOGRAMA(?);`;
        await connection.query(query,[idProyecto]);
        res.status(200).json({message: "Cronograma creado"});
    } catch (error) {
        next(error);
    }
}

async function actualizar(req,res,next){
    const {idProyecto,fechaInicio,fechaFin} = req.body;
    try {
        const query = `CALL ACTUALIZAR_CRONOGRAMA(?,?,?);`;
        await connection.query(query,[idProyecto,fechaInicio,fechaFin]);
        res.status(200).json({message: "Cronograma actualizado"});
    } catch (error) {
        next(error);
    }
}

async function listar(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL LISTAR_CRONOGRAMA_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({cronograma: results[0][0]});
    } catch (error) {
        next(error);
    }
}


async function listarEntregablesXidProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({entregables: results[0]});
    } catch (error) {
        next(error);
    }
}

async function eliminar(idCronograma){
    //const { idCronograma } = req.body;
    console.log(`Procediendo: Eliminar/Cronograma ${idCronograma}...`);
    try {
        const result = await funcEliminar(idCronograma);
        // res.status(200).json({
        //     idCronograma,
        //     message: "Cronograma eliminado"});
        console.log(`Cronograma ${idCronograma} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Cronograma", error);
    }
}

async function funcEliminar(idCronograma) {
    try {
        const query = `CALL ELIMINAR_CRONOGRAMA_X_ID_CRONOGRAMA(?);`;
        [results] = await connection.query(query,[idCronograma]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Cronograma", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/Cronograma del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`Cronograma del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Cronograma X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_CRONOGRAMA_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Cronograma X Proyecto", error);
        return 0;
    }
    return 1;
}

async function descargarExcel(req,res,next){
    const {tareas} = req.body;
    //console.log(req.body);
    try{
        const workbook = await generarExcel(tareas,`tareas`);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `tareas.xlsx`);

        // Enviar el archivo
        await workbook.xlsx.write(res);
        res.end();
    }catch(error){
        next(error);
    }
}

async function generarExcel(tareas,nombreArchivo){
    try{
        const workbook = new ExcelJS.Workbook();
        const WSTareas = workbook.addWorksheet("Tareas");
        let filaActual = 1;
        
        let cadenaTarea = "";
        const header1 = ["Cronograma de tareas"];
        const header2 = ["Codigo","Nombre","Descripcion","Horas asignadas","Entregable Asignado","Fecha de inicio","Fecha de fin","Estado","Progreso"];
        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,header1,headerTitulo,borderStyle);
        
        WSTareas.mergeCells(filaActual-1, 1, filaActual-1, 9);
        const mergedCell = WSTareas.getCell(filaActual-1, 1);
        mergedCell.style = {
            ...mergedCell.style, // Mantén los estilos previos
            alignment: alignmentCenterStyle
        };

        filaActual = await excelJSController.agregaHeader(WSTareas,filaActual,header2,headerTitulo,borderStyle);

        const destinationFolder = path.join(__dirname, '../../tmp');
        const excelFilePath = path.join(destinationFolder, `${nombreArchivo}.xlsx`);
        console.log(excelFilePath,filaActual);

        let nroTarea = 1;
        for(const tarea of tareas){
            filaActual = await agregarTareaAExcel(tarea,WSTareas,filaActual,`${nroTarea}`);
            nroTarea++;
        }

        excelJSController.ajustarAnchoColumnas(WSTareas);
        await workbook.xlsx.writeFile(excelFilePath);
        return workbook;
    }catch(error){
        console.log(error);
    }
}



async function agregarTareaAExcel(tarea,WSTareas,filaActual,cadenaTarea){
    try {
        let nroTarea = 1;
        if(tarea.fechaInicio == "0000-00-00"){
            tarea.fechaInicio = "Dependiente";
        }else{
            tarea.fechaInicio = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaInicio);
        }
        
        if(tarea.nombreEntregable == null){
            tarea.nombreEntregable = "Sin entregable asociado";
        }
        tarea.fechaFin = await dateController.formatearFecha2D_MM_YYYY(tarea.fechaFin);
        WSTareas.getRow(filaActual).values = [cadenaTarea,tarea.sumillaTarea,tarea.descripcion,tarea.horasPlaneadas,tarea.nombreEntregable,tarea.fechaInicio,tarea.fechaFin,tarea.nombreTareaEstado,`${tarea.porcentajeProgreso}%`];
        filaActual++;
        
        if(tarea.tareasHijas){
            for(const tareaHija of tarea.tareasHijas){
                //console.log("Tarea posterior: ",tareaPosterior.idTarea);
                filaActual = await agregarTareaAExcel(tareaHija,WSTareas,filaActual,`${cadenaTarea}.${nroTarea}`);
                nroTarea++;
            }
        }
        
    } catch (error) {
        console.log(error);
    }
    return filaActual;
}

module.exports = {
    crear,
    actualizar,
    eliminar,
    eliminarXProyecto,
    listar,
    listarEntregablesXidProyecto,
    descargarExcel
};
