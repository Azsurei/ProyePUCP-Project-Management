const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaActaReunion,descripcion} = req.body;
    try {
        const query = `CALL INSERTAR_COMENTARIO_REUNION(?,?,?);`;
        await connection.query(query,[idLineaActaReunion,descripcion]);
        res.status(200).json({message: "Comentario reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const results = await connection.query(query,[idLineaActaReunion]);
        const comentariosReunion = results[0];
        res.status(200).json({
            comentariosReunion,
            message: "Comentarios de reunion listados"});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    crear,
    listarXIdLineaActaReunion
}