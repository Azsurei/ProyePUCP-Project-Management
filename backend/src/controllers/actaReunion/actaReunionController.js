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

async function eliminar(idActaReunion){
    //const { idActaReunion } = req.body;
    console.log(`Procediendo: Eliminar/ActaReunion ${idActaReunion}...`);
    try {
        const result = await funcEliminar(idActaReunion);
        // res.status(200).json({
        //     idActaReunion,
        //     message: "ActaReunion eliminado"});
        console.log(`ActaReunion ${idActaReunion} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ActaReunion", error);
    }
}

async function funcEliminar(idActaReunion) {
    try {
        const query = `CALL ELIMINAR_ACTA_REUNION_X_ID_ACTA_REUNION(?);`;
        [results] = await connection.query(query,[idActaReunion]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaReunion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/ActaReunion del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`ActaReunion del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ActaReunion X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_ACTA_REUNION_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaReunion X Proyecto", error);
        return 0;
    }
    return 1;
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
    listarXIdProyecto,
    eliminar,
    eliminarXProyecto
}