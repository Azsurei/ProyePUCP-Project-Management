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

module.exports = {
    listarColumnas,
    listarTareasTodasSinPosteriores,
    listarColumnasYTareas
};