const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPlanCalidad,descripcion} = req.body;
    try {
        idEstandarCalidad = await funcCrear(idPlanCalidad,descripcion);
        res.status(200).json({
            idEstandarCalidad,
            message: "Estandar de Calidad creada"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idPlanCalidad, descripcion){
    try {
        const query = `CALL INSERTAR_ESTANDAR_CALIDAD(?,?);`;
        [results]=await connection.query(query,[idPlanCalidad, descripcion]);
        idEstandarCalidad = results[0][0].idEstandarCalidad;
    } catch (error) {
        nexy(error);
    }
    return idEstandarCalidad;
}

async function listarXIdPlanCalidad(req,res,next){
    const {idPlanCalidad} = req.params;
    try {
        const estandaresCalidad = await funcListarXIdPlanCalidad(idPlanCalidad);
        res.status(200).json({
            estandaresCalidad,
            message: "Estandares de Calidad listadas"});
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdPlanCalidad(idPlanCalidad){
    let estandaresCalidad;
    try {
        const query = `CALL LISTAR_ESTANDAR_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        const [results] = await connection.query(query,[idPlanCalidad]);
        estandaresCalidad = results[0];
    } catch (error) {
        console.error("Error al listar Estandares de Calidad:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return estandaresCalidad;
}

module.exports = {
    crear,
    listarXIdPlanCalidad,
    funcCrear,
    funcListarXIdPlanCalidad,
}