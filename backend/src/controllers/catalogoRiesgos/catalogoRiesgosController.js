const connection = require("../../config/db");

async function insertarRiesgo(req,res,next){
    const{idProyecto, nombreRiesgo, fechaIdentificacion, duenoRiesgo, detalleRiesgo, causaRiesgo, 
        impactoRiesgo, planRespuesta, estado, responsables} = req.body;
    const query = `CALL INSERTAR_COMUNICACION_X_IDPROYECTO(?,?,?,?,?,?,?,?,?);`;
    try {
        const [results] = await connection.query(query,[idProyecto, nombreRiesgo, fechaIdentificacion, duenoRiesgo,
            detalleRiesgo, detalleRiesgo, causaRiesgo, impactoRiesgo, planRespuesta, estado]);
        const idRiesgo = results[0][0].idRiesgo;
        console.log(`Se generó el riesgo ${idRiesgo}!`);
        for(const responsable of responsables){
            const [results1] = await connection.execute(`
            CALL INSERTAR_RESPONSABLE_RIESGO(
                ${idRiesgo},
                ${responsable.idResponsable});
            `);
            console.log(`Se inserto el responsable ${responsable.idResponsable} al riesgo ${idRiesgo}`);
        }
        res.status(200).json({
            idRiesgo,
            message: "Riesgo insertado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarProbabilidades(req,res,next){
    try {
        const query = `CALL LISTAR_PROBABILIDAD;`;
        const [results] = await connection.query(query);
        const probabilidades = results[0];
        res.status(200).json({probabilidades, message: "Probabilidades listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}
async function listarImpacto(req,res,next){
    try {
        const query = `CALL LISTAR_IMPACTO;`;
        const [results] = await connection.query(query);
        const impacto = results[0];
        res.status(200).json({impacto, message: "Impacto listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports = {
    insertarRiesgo,
    listarProbabilidades,
    listarImpacto
};
