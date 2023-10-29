const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaActaReunion,descripcion} = req.body;
    try {
        idComentario = await funcCrear(idLineaActaReunion,descripcion);
        res.status(200).json({message: "Comentario reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const comentariosReunion = await funcListarXIdLineaActaReunion(idLineaActaReunion);
        res.status(200).json({
            comentariosReunion,
            message: "Comentarios de reunion listados"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idLineaActaReunion,descripcion){
    try {
        const query = `CALL INSERTAR_COMENTARIO_REUNION(?,?);`;
        [results] = await connection.query(query,[idLineaActaReunion,descripcion]);
        idComentario = results[0][0].idComentario;
    } catch (error) {
        next(error);
    }
    return idComentario;
}

async function funcListarXIdLineaActaReunion(idLineaActaReunion){
    let comentarios;
    try {
        const query = `CALL LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(?)`;  // Asume que tienes un procedimiento almacenado en tu base de datos para esto
        const [results] = await connection.query(query, [idLineaActaReunion]);
        comentarios = results[0];
    } catch (error) {
        console.error("Error al listar comentarios de reunion:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return comentarios;
}

async function funcModificar(idComentarioReunion,descripcion){
    try {
        const query = `CALL MODIFICAR_COMENTARIO_REUNION(?,?);`;
        const [results]=await connection.query(query,[idComentarioReunion,descripcion]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdLineaActaReunion,
    funcCrear,
    funcListarXIdLineaActaReunion,
    funcModificar
}