const connection = require("../config/db");

async function listarColumnas(idProyecto){
    try {
        const query = `CALL LISTAR_COLUMNA_KANBAN(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const columnas = results[0];

        console.log("LISTA DE COLUMNAS COMPLETA ====" + columnas);
        
        return columnas;
    } catch (error) {
        console.log(error);
    }
}


async function listarTareasTodasSinPosteriores(idProyecto){
    try {
        const query = `CALL LISTAR_TAREAS_SIN_POSTERIORES_X_ID_PROYECTO(?);`;
        const [resultsTareas] = await connection.query(query, [idProyecto]);
        tareas = resultsTareas[0];
        
        return tareas;
    } catch (error) {
        console.log(error);
    }
}

async function listarColumnasYTareas(req,res,next){
    const {idProyecto} = req.params;
    try {
        const columnas = await listarColumnas(idProyecto);
        const tareas   = await listarTareasTodasSinPosteriores(idProyecto);
        const data = {
            columnas,
            tareas
        };

        res.status(200).json({
            data,
            message: "Se listaron las columnas y tareas con exito"
        });
    } catch (error) {
        next(error);
    }
}


async function cambiarPosicionTarea(req,res,next){
    const {idTarea, posicionKanban, idColumnaKanban} = req.body;
    try{
        const query = `CALL CAMBIAR_POSICION_TAREA(?,?,?);`;
        const [results] = await connection.query(query, [idTarea, posicionKanban, idColumnaKanban]);
        const tareas = results[0];

        res.status(200).json({
            tareas,
            message: "Se modificaron las posiciones de las tareas correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function crearColumna(req,res,next){
    const {idProyecto, nombre} = req.body;
    try{
        const query = `CALL CREAR_COLUMNA_KANBAN(?,?);`;
        const [results] = await connection.query(query, [idProyecto, nombre]);
        const columnaId = results[0][0].idColumnaKanban;
        console.log("LA COLUMNA ID ES "+columnaId);
        res.status(200).json({
            columnaId,
            message: "Se modificaron las posiciones correctamente"
        });
    } catch (error) {
        next(error);
    }
}

async function cambiarPosicionColumna(req,res,next){
    const {idColumnaKanban, posicion} = req.body;
    try{
        const query = `CALL CAMBIAR_POSICION_COLUMNA_KANBAN(?,?);`;
        const [results] = await connection.query(query, [idColumnaKanban, posicion]);
        res.status(200).json({
            message: "Se modificaron las posiciones de las columnas correctamente"
        });
    } catch (error) {
        next(error);
    }
}


async function renombrarColumna(req,res,next){
    const {idColumnaKanban, nombre} = req.body;
    try{
        const query = `CALL MODFICAR_NOMBRE_COLUMNA_KANBAN(?,?);`;
        const [results] = await connection.query(query, [idColumnaKanban, nombre]);
        res.status(200).json({
            message: "Se actualizo el nombre de la columna correctamente"
        });
    } catch (error) {
        next(error);
    }
}


async function eliminarColumna(req,res,next){
    const {idColumnaKanban} = req.body;
    try{
        const query = `CALL ELIMINAR_COLUMNA_KANBAN(?);`;
        const [results] = await connection.query(query, [idColumnaKanban]);
        res.status(200).json({
            message: "Se elimino la columna correctamente"
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    listarColumnas,
    listarTareasTodasSinPosteriores,
    listarColumnasYTareas,
    cambiarPosicionTarea,
    crearColumna,
    cambiarPosicionColumna,
    renombrarColumna,
    eliminarColumna
};