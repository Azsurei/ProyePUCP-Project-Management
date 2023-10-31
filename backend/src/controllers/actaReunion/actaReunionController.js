const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        idActaReunion = await funcCrear(idProyecto);
        res.status(200).json({
            idActaReunion,
            message: "Acta de reunion creada"});
    } catch (error) {
        next(error);
    }
}

        

async function listarXIdProyecto(req, res, next) {
    const { idProyecto } = req.params;
    try {

        const query = `CALL LISTAR_ACTA_REUNION_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        actaReunion = results[0][0];

        res.status(200).json({
            data: actaReunion,
            message: "Acta de reunión listada"
        });
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idProyecto){
    try {
        const query = `CALL INSERTAR_ACTA_REUNION(?);`;
        [resultsActaReunion]=await connection.query(query,[idProyecto]);
        idActaReunion = resultsActaReunion[0][0].idActaReunion;
    } catch (error) {
        idActaReunion = 0;
    }
    return idActaReunion;
}



// const query = `CALL LISTAR_ACTA_REUNION_X_ID_PROYECTO(?);`;
// const [resultsActaReunion] = await connection.query(query, [idProyecto]);

// const actaReunion = resultsActaReunion[0][0];


// const query2 = `CALL LISTAR_LINEA_ACTA_REUNION_X_ID_ACTA_REUNION(?);`;
// const [resulstLineasActaReunion] = await connection.query(query2, [actaReunion.idActaReunion]);
// actaReunion.lineasActaReunion = resulstLineasActaReunion[0];
// const lineasActaReunion = actaReunion.lineasActaReunion;


// for (const linea of lineasActaReunion) {
//     const query3 = `CALL LISTAR_TEMA_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
//     const [resultsTemasReunion] = await connection.query(query3, [linea.idLineaActaReunion]);

//     const temasReunion = resultsTemasReunion[0];
//     linea.temas = temasReunion;
    
//     for (const tema of temasReunion) {
//         const query4 = `CALL LISTAR_ACUERDO_X_ID_TEMA_REUNION(?);`;
//         const [resultsAcuerdos] = await connection.query(query4, [tema.idTemaReunion]);
//         const acuerdos = resultsAcuerdos[0];
//         tema.acuerdos = acuerdos;

//         console.log(tema.acuerdos);
//         for (const acuerdo of acuerdos) {
//             const query5 = `CALL LISTAR_RESPONSABLE_ACUERDO_X_ID_ACUERDO(?);`;
//             const [resultsResponsables] = await connection.query(query5, [acuerdo.idAcuerdo]);
//             acuerdo.responsables = resultsResponsables[0];
//         }
//     }

//     const query6 = `CALL LISTAR_PARTICIPANTE_X_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
//     const [resultsParticipantes] = await connection.query(query6, [linea.idLineaActaReunion]);
//     linea.participantes = resultsParticipantes[0];

//     const query7 = `CALL LISTAR_COMENTARIO_REUNION_X_ID_LINEA_ACTA_REUNION(?);`;
//     const [resultsComentarios] = await connection.query(query7, [linea.idLineaActaReunion]);
//     linea.comentarios = resultsComentarios[0];
module.exports = {
    crear,
    listarXIdProyecto
}