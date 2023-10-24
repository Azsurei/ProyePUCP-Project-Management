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
        const [resultActaReunion] = await connection.query(query,[idProyecto]);
        const actaReunion = resultActaReunion[0];


        const query2 = `CALL LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(?);`;
        const [resultsLineasActaReunion] = await connection.query(query2,[actaReunion.idActaReunion]);
        const lineasActaReunion = resultsLineasActaReunion[0];

        for(const lineaActaReunion of lineasActaReunion){
            const query3 = `CALL LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
            const [resultsTemasReunion] = await connection.query(query3,[lineaActaReunion.idLineaActaReunion]);
            const temasReunion = resultsTemasReunion[0];
            lineaActaReunion.temas = temasReunion;

            for(const temaReunion of temasReunion){
                const query4 = `CALL LISTAR_ACUERDO_X_ID_TEMA_REUNION(?);`;
                const [resultsAcuerdos] = await connection.query(query4,[temaReunion.idTemaReunion]);
                const acuerdos = resultsAcuerdos[0];

                for(const acuerdo of acuerdos){
                    const query5 = `CALL LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(?);`;
                    const [resultsResponsables] = await connection.query(query5,[acuerdo.idAcuerdo]);
                    const responsables = resultsResponsables[0];
                    acuerdo.responsables = responsables;
                }
            }

            const query6 = `CALL LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
            const [resultsParticipantes] = await connection.query(query6,[lineaActaReunion.idLineaActaReunion]);
            const participantes = resultsParticipantes[0];
            lineaActaReunion.participantes = participantes;

            const query7 = `CALL LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
            const [resultsComentarios] = await connection.query(query7,[lineaActaReunion.idLineaActaReunion]);
            const comentarios = resultsComentarios[0];
            lineaActaReunion.comentarios = comentarios;
        }

        actaReunion.lineasActaReunion = lineasActaReunion;
        res.status(200).json({
            actaReunion,
            message: "Acta de reunion listada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listarXIdProyecto
}