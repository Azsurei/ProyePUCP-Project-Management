const connection = require("../../config/db");

async function crear(req,res,next){
    const {idPlanCalidad,descripcionMetrica,fuente,frecuencia,responsable,limitesControl} = req.body;
    try {
        idMetricaCalidad = await funcCrear(idPlanCalidad,descripcionMetrica,fuente,frecuencia,responsable,limitesControl);
        res.status(200).json({
            idMetricaCalidad,
            message: "Metrica de Calidad creada"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idPlanCalidad,descripcionMetrica,fuente,frecuencia,responsable,limitesControl){
    try {
        const query = `CALL INSERTAR_METRICA_CALIDAD(?,?,?,?,?,?);`;
        [results]=await connection.query(query,[idPlanCalidad,descripcionMetrica,fuente,frecuencia,responsable,limitesControl]);
        idMetricaCalidad = results[0][0].idMetricaCalidad;
    } catch (error) {
        nexy(error);
    }
    return idMetricaCalidad;
}

async function listarXIdPlanCalidad(req,res,next){
    const {idPlanCalidad} = req.params;
    try {
        const metricasCalidad = await funcListarXIdPlanCalidad(idPlanCalidad);
        res.status(200).json({
            metricasCalidad,
            message: "Metricas de Calidad listadas"});
    } catch (error) {
        next(error);
    }
}

async function funcListarXIdPlanCalidad(idPlanCalidad){
    let metricasCalidad;
    try {
        const query = `CALL LISTAR_METRICA_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        const [results] = await connection.query(query,[idPlanCalidad]);
        metricasCalidad = results[0];
    } catch (error) {
        console.error("Error al listar Metricas de Calidad:", error);
        throw error; // Reenviar el error para ser manejado por el middleware de manejo de errores
    }
    return metricasCalidad;
}

module.exports = {
    crear,
    listarXIdPlanCalidad,
    funcCrear,
    funcListarXIdPlanCalidad,
}