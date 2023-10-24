const connection = require("../../config/db");

async function crear(req,res,next){
    const {actaReunion} = req.body;
    try {
        const query = `CALL INSERTAR_ACTA_REUNION(?);`;
        [resultsActaReunion]=await connection.query(query,[actaReunion.idProyecto]);
        idActaReunion = resultsActaReunion[0][0].idActaReunion;

        const lineasActaReunion = actaReunion.lineasActaReunion;
        for(const linea of lineasActaReunion){
            const query = `CALL INSERTAR_LINEA_ACTA_REUNION(?,?,?,?,?,?);`;
            [resultsLineActaReunion]=await connection.query(query,[idActaReunion,linea.nombreReunion,linea.fechaReunion,linea.horaReunion,linea.nombreConvocante,linea.motivo]);
            idLineaActaReunion = resultsLineActaReunion[0][0].idLineaActaReunion;
            
            const temas = linea.temas;
            for(const tema of temas){
                const query = `CALL INSERTAR_TEMA_REUNION(?,?);`;
                await connection.query(query,[idLineaActaReunion,tema.descripcion]);

                const acuerdos = tema.acuerdos;
                for(const acuerdo of acuerdos){
                    const query = `CALL INSERTAR_ACUERDO(?,?,?);`;
                    [resultsAcuerdo] =await connection.query(query,[acuerdo.idTemaReunion,acuerdo.descripcion,acuerdo.fechaObjetivo]);
                    idAcuerdo = resultsAcuerdo[0][0].idAcuerdo;

                    const responsables = acuerdo.responsables;
                    for(const responsable of responsables){
                        const query = `CALL INSERTAR_RESPONSABLE_ACUERDO(?,?);`;
                        await connection.query(query,[idAcuerdo,responsable.idUsuarioXRolXProyecto]);
                    }
                }
            }

            const participantes = linea.participantes;
            for(const participante of participantes){
                const query = `CALL INSERTAR_PARTICIPANTE_X_REUNION(?,?,?);`;
                await connection.query(query,[idLineaActaReunion,participante.idUsuarioXRolXProyecto,participante.asistio]);
            }

            const comentarios = linea.comentarios;
            for(const comentario of comentarios){
                const query = `CALL INSERTAR_COMENTARIO_REUNION(?,?);`;
                await connection.query(query,[idLineaActaReunion,comentario.descripcion]);
            }
        }


        res.status(200).json({message: "Acta de reunion creada"});
    } catch (error) {
        next(error);
    }
}

async function listarXIdProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_ACTA_REUNION_X_ID_PROYECTO(?);`;
        const results = await connection.query(query,[idProyecto]);
        const actasReunion = results[0];
        res.status(200).json({
            actasReunion,
            message: "Acta de reunion listada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdProyecto
}