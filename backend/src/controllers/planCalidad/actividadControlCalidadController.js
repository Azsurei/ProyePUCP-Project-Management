const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPlanCalidad,descripcion} = req.body;
    try {
        idActividadControlCalidad = await funcCrear(idPlanCalidad,descripcion);
        res.status(200).json({
            idActividadControlCalidad,
            message: "Actividad de Control de Calidad creada"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idPlanCalidad, descripcion){
    try {
        const query = `CALL INSERTAR_ACTIVIDAD_CONTROL_CALIDAD(?,?);`;
        [results]=await connection.query(query,[idPlanCalidad, descripcion]);
        idActividadControlCalidad = results[0][0].idActividadControlCalidad;
    } catch (error) {
        nexy(error);
    }
    return idActividadControlCalidad;
}

async function listarXIdPlanCalidad(req,res,next){
    const {idPlanCalidad} = req.params;
    try {
        const actividadesControlCalidad = await funcListarXIdPlanCalidad(idPlanCalidad);
        res.status(200).json({
            actividadesControlCalidad,
            message: "Actividades de Control de Calidad listadas"});
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdPlanCalidad(idPlanCalidad){
    let actividadesControlCalidad;
    try {
        const query = `CALL LISTAR_ACTIVIDAD_CONTROL_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        const [results] = await connection.query(query,[idPlanCalidad]);
        actividadesControlCalidad = results[0];
    } catch (error) {
        console.error("Error al listar Actividades de Control de Calidad:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return actividadesControlCalidad;
}

module.exports = {
    crear,
    listarXIdPlanCalidad,
    funcCrear,
    funcListarXIdPlanCalidad,
}