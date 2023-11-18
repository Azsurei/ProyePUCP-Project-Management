const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        idPlanCalidad = await funcCrear(idProyecto);
        res.status(200).json({
            idPlanCalidad,
            message: "Plan de Calidad creado"});
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idProyecto){
    try {
        const query = `CALL INSERTAR_PLAN_CALIDAD(?);`;
        [results]=await connection.query(query,[idProyecto]);
        idPlanCalidad = results[0][0].idPlanCalidad;
    } catch (error) {
        idPlanCalidad = 0;
    }
    return idPlanCalidad;
}

async function eliminar(idPlanCalidad){
    //const { idActaReunion } = req.body;
    console.log(`Procediendo: Eliminar/PlanCalidad ${idPlanCalidad}...`);
    try {
        const result = await funcEliminar(idPlanCalidad);
        // res.status(200).json({
        //     idActaReunion,
        //     message: "ActaReunion eliminado"});
        console.log(`PlanCalidad ${idPlanCalidad} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/PlanCalidad", error);
    }
}

async function funcEliminar(idPlanCalidad) {
    try {
        const query = `CALL ELIMINAR_PLAN_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        [results] = await connection.query(query,[idPlanCalidad]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaReunion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/PlanCalidad del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`PlanCalidad del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/PlanCalidad X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_PLAN_CALIDAD_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/PlanCalidad X Proyecto", error);
        return 0;
    }
    return 1;
}

module.exports = {
    crear,
    eliminar,
    eliminarXProyecto
}