const connection = require("../../config/db");

async function crear(req, res, next) {
    const { idProyecto } = req.body;
    try {
        idPlanCalidad = await funcCrear(idProyecto);
        res.status(200).json({
            idPlanCalidad,
            message: "Plan de Calidad creado",
        });
    } catch (error) {
        next(error);
    }
}

async function funcCrear(idProyecto) {
    try {
        const query = `CALL INSERTAR_PLAN_CALIDAD(?);`;
        [results] = await connection.query(query, [idProyecto]);
        idPlanCalidad = results[0][0].idPlanCalidad;
    } catch (error) {
        idPlanCalidad = 0;
    }
    return idPlanCalidad;
}

async function listar(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_PLAN_CALIDAD_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        planCalidad = results[0][0];

        res.status(200).json({
            data: planCalidad,
            message: "Plan de Calidad listado",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminar(idPlanCalidad) {
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
        [results] = await connection.query(query, [idPlanCalidad]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaReunion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto) {
    // const { idProductBacklog } = req.body;
    console.log(
        `Procediendo: Eliminar/PlanCalidad del Proyecto ${idProyecto}...`
    );
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
        [results] = await connection.query(query, [idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/PlanCalidad X Proyecto", error);
        return 0;
    }
    return 1;
}

async function insertarPlanCalidad(req, res, next) {
    const {
        idPlanCalidad,
        estandares,
        actividadesPrevencion,
        actividadesControl,
    } = req.body;
    try {
        for (const estandar of estandares) {
            await connection.query(`
                CALL INSERTAR_ESTANDAR_CALIDAD(
                ${idPlanCalidad},
                '${estandar.standars}');
            `);
        }
        for (const actividadPrevencion of actividadesPrevencion) {
            await connection.query(`
                CALL INSERTAR_ACTIVIDAD_PREVENCION(
                ${idPlanCalidad},
                '${actividadPrevencion.activities}');
            `);
        }
        for (const actividadControl of actividadesControl) {
            await connection.query(`
                CALL INSERTAR_ACTIVIDAD_CONTROL_CALIDAD(
                ${idPlanCalidad},
                '${actividadControl.activitiesControl}');
            `);
        }
        res.status(200).json({
            message: "Se ha insertado exitosamente",
        });
    } catch (error) {
        console.error("Error en la inserción:", error);
        res.status(500).send("Error en la inserción: " + error.message);
    }
}

async function listarXIdPlanCalidad(req, res, next) {
    const { idPlanCalidad } = req.params;
    try {
        const query = `CALL LISTAR_ESTANDAR_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        const [results] = await connection.query(query, [idPlanCalidad]);
        estandaresCalidad = results[0];

        const query1 = `CALL LISTAR_ACTIVIDAD_PREVENCION_X_ID_PLAN_CALIDAD(?);`;
        const [results1] = await connection.query(query1, [idPlanCalidad]);
        actividadesPrevencion = results1[0];

        const query2 = `CALL LISTAR_ACTIVIDAD_CONTROL_CALIDAD_X_ID_PLAN_CALIDAD(?);`;
        const [results2] = await connection.query(query2, [idPlanCalidad]);
        actividadesControlCalidad = results2[0];

        res.status(200).json({
            estandaresCalidad,
            actividadesPrevencion,
            actividadesControlCalidad,
            message: "Interesado obtenido exitosamente",
        });
        console.log("Se listó el interesado correctamente");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarCamposDinamicos(req, res, next) {
    const { estandares, actividadesPrevencion, actividadesControl } = req.body;
    try {
        const query = `CALL ELIMINAR_ESTANDAR_CALIDAD(?);`;
        for (const estandar of estandares) {
            await connection.query(query, [estandar.idStandars]);
        }
        const query1 = `CALL ELIMINAR_ACTIVIDAD_PREVENCION(?);`;
        for (const activity of actividadesPrevencion) {
            await connection.query(query1, [activity.idActivities]);
        }
        const query2 = `CALL ELIMINAR_ACTIVIDAD_CONTROL_CALIDAD(?);`;
        for (const activityControl of actividadesControl) {
            await connection.query(query2, [activityControl.idActivitiesControl]);
        }

        res.status(200).json({
            message: "Campos dinámicos de plan de calidad eliminado exitosamente",
        });
        console.log(
            "Se elimino los campos dinámicos de plan de calidad correctamente"
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function modificarPlanCalidad(req,res,next){
    //dejare el idPlanCalidad por si luego la pantalla agrega datos exclusivamente de la tabla de plan de calidad
    const {idPlanCalidad,estandares, actividadesPrevencion, actividadesControl} = req.body;
    try {
        const query = `CALL MODIFICAR_ESTANDAR_CALIDAD(?,?);`;
        for(const estandar of estandares){
            await connection.query(query,[estandar.idStandars,estandar.standars]);
        }
        const query1 = `CALL MODIFICAR_ACTIVIDAD_PREVENCION(?,?);`;
        for(const activity of actividadesPrevencion){
            await connection.query(query1,[activity.idActivities,activity.activities]);
        }
        const query2 = `CALL MODIFICAR_ACTIVIDAD_CONTROL_CALIDAD(?,?);`;
        for(const activityControl of actividadesControl){
            await connection.query(query2,[activityControl.idActivitiesControl,activityControl.activitiesControl]);
        }
        res.status(200).json({
            message: "Plan de calidad y campos dinámicos modificados exitosamente"
        });
        console.log('Se modifico el plan de calidad y los campos dinámicos correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    crear,
    listar,
    eliminar,
    eliminarXProyecto,
    insertarPlanCalidad,
    listarXIdPlanCalidad,
    modificarPlanCalidad,
    eliminarCamposDinamicos,
};
