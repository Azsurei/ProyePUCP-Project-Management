const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPlanCalidad,descripcion} = req.body;
    try {
        idActividadPrevencion = await funcCrear(idPlanCalidad,descripcion);
        res.status(200).json({
            idActividadPrevencion,
            message: "Actividad de Prevencion creada"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idPlanCalidad, descripcion){
    try {
        const query = `CALL INSERTAR_ACTIVIDAD_PREVENCION(?,?);`;
        [results]=await connection.query(query,[idPlanCalidad, descripcion]);
        idActividadPrevencion = results[0][0].idActividadPrevencion;
    } catch (error) {
        next(error);
    }
    return idActividadPrevencion;
}

async function listarXIdPlanCalidad(req,res,next){
    const {idPlanCalidad} = req.params;
    try {
        const actividadesPrevencion = await funcListarXIdPlanCalidad(idPlanCalidad);
        res.status(200).json({
            actividadesPrevencion,
            message: "Actividades de Prevencion listadas"});
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdPlanCalidad(idPlanCalidad){
    let actividadesPrevencion;
    try {
        const query = `CALL LISTAR_ACTIVIDAD_PREVENCION_X_ID_PLAN_CALIDAD(?);`;
        const [results] = await connection.query(query,[idPlanCalidad]);
        actividadesPrevencion = results[0];
    } catch (error) {
        console.error("Error al listar Actividades de Prevencion:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return actividadesPrevencion;
}

module.exports = {
    crear,
    listarXIdPlanCalidad,
    funcCrear,
    funcListarXIdPlanCalidad,
}