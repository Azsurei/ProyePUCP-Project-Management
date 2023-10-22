const connection = require("../../config/db");

async function insertarRiesgo(req,res,next){
    const{idProyecto, idProbabilidad, idImpacto, nombreRiesgo, fechaIdentificacion, duenoRiesgo, detalleRiesgo, causaRiesgo, 
        impactoRiesgo, estado, responsables, planesRespuesta, planesContigencia} = req.body;
    const query = `CALL INSERTAR_RIESGO_X_IDPROYECTO(?,?,?,?,?,?,?,?,?,?);`;
    try {
        const [results] = await connection.query(query,[idProyecto,idProbabilidad,idImpacto, nombreRiesgo, fechaIdentificacion, duenoRiesgo,
            detalleRiesgo, detalleRiesgo, causaRiesgo, impactoRiesgo, estado]);
        const idRiesgo = results[0][0].idRiesgo;
        console.log(`Se generó el riesgo ${idRiesgo}!`);
        for(const responsable of responsables){
            await connection.execute(`
                CALL INSERTAR_RESPONSABLE_RIESGO(
                ${idRiesgo},
                ${responsable.idResponsable});
            `);
        }
        for(const planRespuesta of planesRespuesta){
            await connection.execute(`
                CALL INSERTAR_PLANRESPUESTA(
                ${idRiesgo},
                '${planRespuesta.descripcion}');
            `);
        }
        for(const planContigencia of planesContigencia){
            await connection.execute(`
                CALL INSERTAR_PLANCONTIGENCIA(
                ${idRiesgo},
                '${planContigencia.descripcion}');
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
    listarRiesgos,
    listarunRiesgo,
    listarProbabilidades,
    listarImpacto
};
