const connection = require("../../config/db");

async function crear(req,res,next){
    const {idLineaActaReunion,idUsuarioXRolXProyecto,asistio} = req.body;
    try {
        idParticipanteXReunion = await funcCrear(idLineaActaReunion,idUsuarioXRolXProyecto,asistio);
        res.status(200).json({message: "Participante x reunion creado"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdLineaActaReunion(req,res,next){
    const {idLineaActaReunion} = req.params;
    try {

        const participantesXReunion = await funcListarXIdLineaActaReunion(idLineaActaReunion);
        res.status(200).json({
            participantesXReunion,
            message: "Participantes x reunion listados"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idLineaActaReunion,idUsuarioXRolXProyecto,asistio){
    try {
        const query = `CALL INSERTAR_PARTICIPANTE_X_REUNION(?,?,?);`;
        results = await connection.query(query,[idLineaActaReunion,idUsuarioXRolXProyecto,asistio]);
        idParticipanteXReunion = results[0][0].idParticipanteXReunion;
    } catch (error) {
        next(error);
    }
    return idParticipanteXReunion;
}

async function funcListarXIdLineaActaReunion(idLineaActaReunion){
    let participantesXReunion;
    try {
        const query = `CALL LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
        const [results] = await connection.query(query,[idLineaActaReunion]);
        participantesXReunion = results[0];
    } catch (error) {
        next(error);
    }
    return participantesXReunion;
}

async function funcModificar(idParticipanteXReunion,asistio){
    try {
        const query = `CALL MODIFICAR_PARTICIPANTE_X_REUNION(?,?);`;
        const [results]=await connection.query(query,[idParticipanteXReunion,asistio]);
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