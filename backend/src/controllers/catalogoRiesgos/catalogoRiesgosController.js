const connection = require("../../config/db");

async function insertarRiesgo(req,res,next){
    const{idProyecto, idProbabilidad, idImpacto, nombreRiesgo, fechaIdentificacion, duenoRiesgo, detalleRiesgo, causaRiesgo, 
        impactoRiesgo, estado, responsables, planesRespuesta, planesContigencia} = req.body;
    const query = `CALL INSERTAR_RIESGO_X_IDPROYECTO(?,?,?,?,?,?,?,?,?,?);`;
    try {
        console.log(`Se recibio de datos ${idProyecto}, ${idProbabilidad}, ${idImpacto}, '${nombreRiesgo}', '${fechaIdentificacion}', ${duenoRiesgo},
        '${detalleRiesgo}', '${causaRiesgo}', '${impactoRiesgo}', '${estado}`);
        const [results] = await connection.query(query,[idProyecto,idProbabilidad,idImpacto, nombreRiesgo, fechaIdentificacion, duenoRiesgo,
            detalleRiesgo, causaRiesgo, impactoRiesgo, estado]);
        const idRiesgo = results[0][0].idRiesgo;
        console.log(`Se generó el riesgo ${idRiesgo}!`);
        for(const responsable of responsables){
            await connection.execute(`
                CALL INSERTAR_RESPONSABLE_RIESGO(
                ${idRiesgo},
                ${responsable.idUsuario});
            `);
        }
        for(const planRespuesta of planesRespuesta){
            await connection.execute(`
                CALL INSERTAR_PLANRESPUESTA(
                ${idRiesgo},
                '${planRespuesta.responsePlans}');
            `);
        }
        for(const planContigencia of planesContigencia){
            await connection.execute(`
                CALL INSERTAR_PLANCONTIGENCIA(
                ${idRiesgo},
                '${planContigencia.contingencyPlans}');
            `);
        }
        res.status(200).json({
            idRiesgo,
            message: "Riesgo insertado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarRiesgos(req,res,next){
    const {idProyecto} = req.params;
    const query = `CALL LISTAR_CATALOGORIESGO_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        const riesgos = results[0];
        for (const riesgo of riesgos){
            const query1 = `CALL LISTAR_RESPONSABLE_X_IDRIESGO(?);`;
            const [responsables] = await connection.query(query1,[riesgo.idRiesgo]);
            riesgo.responsables = responsables[0];
        }
        for (const riesgo1 of riesgos){
            const query2 = `CALL LISTAR_PLANRESPUESTA_X_IDRIESGO(?);`;
            const [planRespuesta] = await connection.query(query2,[riesgo1.idRiesgo]);
            riesgo1.planRespuesta = planRespuesta[0];
        }
        for (const riesgo2 of riesgos){
            const query3 = `CALL LISTAR_PLANCONTINGENCIA_X_IDRIESGO(?);`;
            const [planContigencia] = await connection.query(query3,[riesgo2.idRiesgo]);
            riesgo2.planContigencia = planContigencia[0];
        }
        res.status(200).json({
            riesgos,
            message: "Riesgos obtenidos exitosamente"
        });
        console.log('Se listaron los riesgos correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarunRiesgo(req,res,next){
    const {idRiesgo} = req.params;
    const query = `CALL LISTAR_RIESGO_X_IDRIESGO(?);`;
    try {
        const [results] = await connection.query(query,[idRiesgo]);
        const riesgo = results[0][0];
        //Responsables
        const query1 = `CALL LISTAR_RESPONSABLE_X_IDRIESGO(?);`;
        const [responsables] = await connection.query(query1,[idRiesgo]);
        riesgo.responsables = responsables[0];
        //Plan de Respuesta
        const query2 = `CALL LISTAR_PLANRESPUESTA_X_IDRIESGO(?);`;
        const [planRespuesta] = await connection.query(query2,[idRiesgo]);
        riesgo.planRespuesta = planRespuesta[0];
        //Plan de Contingencia
        const query3 = `CALL LISTAR_PLANCONTINGENCIA_X_IDRIESGO(?);`;
        const [planContigencia] = await connection.query(query3,[idRiesgo]);
        riesgo.planContigencia = planContigencia[0];
        res.status(200).json({
            riesgo,
            message: "Riesgo obtenidos exitosamente"
        });
        console.log('Se listo el riesgo correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}
async function eliminarunRiesgo(req,res,next){
    const {idRiesgo} = req.body;
    const query = `CALL ELIMINAR_RIESGO_X_IDRIESGO(?);`;
    try {
        await connection.query(query,[idRiesgo]);
        res.status(200).json({
            message: "Riesgo eliminado exitosamente"
        });
        console.log('Se elimino el riesgo correctamente');
    } catch (error) {
        console.log(error);
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


async function insertarPlanRespuesta(req,res,next){
    const{idRiesgo, responsePlans} = req.body;
    try {
        const [results] = await connection.execute(`
        CALL INSERTAR_PLANRESPUESTA(
            ${idRiesgo},
            '${responsePlans}');
        `);
        const idPlanRespuesta = results[0].idPlanRespuesta;
        console.log(`Se insertó el plan de respuesta ${idPlanRespuesta}!`);
        res.status(200).json({
            idPlanRespuesta,
            message: "Plan de respuesta insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarPlanRespuesta(req,res,next){
    const {idPlanRespuesta} = req.body;
    const query = `CALL ELIMINAR_PLANRESPUESTA(?);`;
    try {
        await connection.query(query,[idPlanRespuesta]);
        res.status(200).json({
            message: "Plan de Respuesta eliminado exitosamente"
        });
        console.log('Se elimino el Plan de Respuesta correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function insertarPlanContingencia(req,res,next){
    const{idRiesgo, contingencyPlans} = req.body;
    try {
        const [results] = await connection.execute(`
        CALL INSERTAR_PLANCONTIGENCIA(
            ${idRiesgo},
            '${contingencyPlans}');
        `);
        const idPlanContingencia = results[0].idPlanContingencia;
        console.log(`Se insertó el plan de contingencia ${idPlanContingencia}!`);
        res.status(200).json({
            idPlanContingencia,
            message: "Plan de contingencia insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarPlanContingencia(req,res,next){
    const {idPlanContingencia} = req.body;
    const query = `CALL ELIMINAR_PLANCONTINGENCIA(?);`;
    try {
        await connection.query(query,[idPlanContingencia]);
        res.status(200).json({
            message: "Plan de Contingencia eliminado exitosamente"
        });
        console.log('Se elimino el Plan de Contingencia correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function insertarResponsable(req,res,next){
    const {idRiesgo,idUsuario} = req.body;
    const query = `CALL INSERTAR_RESPONSABLE_RIESGO(?,?);`;
    try {
        await connection.query(query,[idRiesgo,idUsuario]);
        res.status(200).json({
            message: "Responsable insertardo"
        });
        console.log('Se inserto el responsable correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarResponsable(req,res,next){
    const {idRiesgo,idUsuario} = req.body;
    const query = `CALL ELIMINAR_RESPONSABLE(?,?);`;
    try {
        await connection.query(query,[idRiesgo,idUsuario]);
        res.status(200).json({
            message: "Responsable eliminado"
        });
        console.log('Se elimino el responsable correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports = {
    insertarRiesgo,
    listarRiesgos,
    listarunRiesgo,
    eliminarunRiesgo,
    listarProbabilidades,
    listarImpacto,
    insertarPlanRespuesta,
    eliminarPlanRespuesta,
    insertarPlanContingencia,
    eliminarPlanContingencia,
    insertarResponsable,
    eliminarResponsable
};
