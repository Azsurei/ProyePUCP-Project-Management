const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaActaReunion,idUsuarioXRolXProyecto,asistio} = req.body;
    try {
        const query = `CALL INSERTAR_PARTICIPANTE_X_REUNION(?,?,?);`;
        await connection.query(query,[idLineaActaReunion,idUsuarioXRolXProyecto,asistio]);
        res.status(200).json({message: "Participante x reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {
        const query = `CALL LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const results = await connection.query(query,[idLineaActaReunion]);
        const participantesXReunion = results[0];


        

        res.status(200).json({
            participantesXReunion,
            message: "Participantes x reunion listados"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdLineaActaReunion
}