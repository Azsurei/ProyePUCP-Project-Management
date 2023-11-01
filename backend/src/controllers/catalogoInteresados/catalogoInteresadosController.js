const connection = require("../../config/db");

async function listarAutoridad(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_AUTORIDAD;`;
        const [results] = await connection.query(query);
        const autoridades = results[0];
        res.status(200).json({autoridades, message: "Autoridades listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function listarAdhesion(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_ADHESION;`;
        const [results] = await connection.query(query);
        const adhesiones = results[0];
        res.status(200).json({adhesiones, message: "Adhesiones listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function insertarInteresado(req,res,next){
    const {cargo, correoElectronico, idAdhesionActual, idAdhesionDeseada, idAutoridad, idProyecto, informacionContacto, nombre, numeroTelefono, organizacion, rol,
        requeriments,strategies} = req.body;
    try {
        // Insertar Interesado
        const query = `CALL INSERTAR_INTERESADO(?,?,?,?,?,?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idProyecto,nombre,rol,organizacion,cargo,correoElectronico,numeroTelefono,informacionContacto,idAutoridad,
            idAdhesionActual,idAdhesionDeseada]);
        console.log(results);
        const idInteresado = results[0][0].idInteresado;
        //Iteracion Requerimientos
        for(const requeriment of requeriments){
            await connection.query(`
                CALL INSERTAR_INTERESADO_REQUERIMIENTO(
                ${idInteresado},
                ${requeriment.requirements});
            `);
        }
        //Iteracion Estrategia
        for(const strategy of strategies){
            await connection.query(`
                CALL INSERTAR_INTERESADO_ESTRATEGIA(
                ${idInteresado},
                ${strategy.strategies});
            `);
        } 
        res.status(200).json({
            message: "Se ha insertado exitosamente"
        });
    } catch (error) {
        console.error("Error en la inserción:", error);
        res.status(500).send("Error en la inserción: " + error.message);
    }
}

async function listarInteresados(req,res,next){
    const {idProyecto} = req.params;
    const query = `CALL LISTAR_CATALOGO_INTERESADOS(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        const interesados = results[0];
        res.status(200).json({
            interesados,
            message: "Interesados obtenidos exitosamente"
        });
        console.log('Se listaron los interesados correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarInteresado(req,res,next){
    const {idInteresado} = req.params;
    try {
        const query = `CALL LISTAR_CATALOGO_INTERESADO_X_ID(?);`;
        const [results] = await connection.query(query,[idInteresado]);
        const interesado = results[0];

        const query1 = `CALL LISTAR_INTERESADO_REQUERIMIENTO(?);`;
        const [results1] = await connection.query(query1,[idInteresado]);
        interesado.requeriments = results1[0];

        const query2 = `CALL LISTAR_INTERESADO_ESTRATEGIA(?);`;
        const [results2] = await connection.query(query2,[idInteresado]);
        interesado.strategies = results2[0];

        res.status(200).json({
            interesado,
            message: "Interesado obtenidos exitosamente"
        });
        console.log('Se listo el interesado correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarInteresado(req,res,next){
    const {idInteresado} = req.body;
    const query = `CALL ELIMINAR_CATALOGO_INTERESADO_X_ID(?);`;
    try {
        await connection.query(query,[idInteresado]);
        res.status(200).json({
            message: "Interesado eliminado exitosamente"
        });
        console.log('Se elimino el interesado correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarRequirementStrategies(req,res,next){
    const {requeriments,strategies} = req.body;
    try {
        const query = `CALL ELIMINAR_CATALOGO_INTERESADO_REQUERIMIENTO(?);`;
        for(const requirement of requeriments){
            await connection.query(query,[requirement.idRequirements]);
        }
        const query1 = `CALL ELIMINAR_CATALOGO_INTERESADO_ESTRATEGIA(?);`;
        for(const strategy of strategies){
            await connection.query(query1,[strategy.idStrategies]);
        }
        res.status(200).json({
            message: "Requerimientos y Estrategias eliminado exitosamente"
        });
        console.log('Se elimino los Requerimientos y Estrategias correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function insertarRequirementStrategies(req,res,next){
    const {idInteresado,requeriments,strategies} = req.body;
    try {
        const query = `CALL INSERTAR_INTERESADO_REQUERIMIENTO(?,?);`;
        for(const requirement of requeriments){
            await connection.query(query,[idInteresado,requirement.requirements]);
        }
        const query1 = `CALL INSERTAR_INTERESADO_ESTRATEGIA(?,?);`;
        for(const strategy of strategies){
            await connection.query(query1,[idInteresado,strategy.strategies]);
        }
        res.status(200).json({
            message: "Requerimientos y Estrategias insertado exitosamente"
        });
        console.log('Se inserto los Requerimientos y Estrategias correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function modificarInteresados(req,res,next){
    const {idInteresado, cargo, correoElectronico, idAdhesionActual, idAdhesionDeseada, idAutoridad, informacionContacto, nombre, numeroTelefono, organizacion, rol,
        requeriments,strategies} = req.body;
    try {
        const query = `CALL MODIFICAR_CATALOGO_INTERESADO_X_ID(?,?,?,?,?,?,?,?,?,?,?);`;
        await connection.query(query,[idInteresado,nombre,rol,organizacion,cargo,correoElectronico,numeroTelefono,informacionContacto,idAutoridad,
            idAdhesionActual,idAdhesionDeseada]);
        const query1 = `CALL MODIFICAR_CATALOGO_INTERESADO_REQUERIMIENTO(?,?);`;
        for(const requirement of requeriments){
            await connection.query(query1,[requirement.idRequirements,requirement.requirements]);
        }
        const query2 = `CALL MODIFICAR_CATALOGO_INTERESADO_ESTRATEGIA(?,?);`;
        for(const strategy of strategies){
            await connection.query(query2,[strategy.idStrategies,strategy.strategies]);
        }
        res.status(200).json({
            message: "Interesado, Requerimientos y Estrategias modificados exitosamente"
        });
        console.log('Se modifico el Interesado y los Requerimientos y Estrategias correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    listarAutoridad,
    listarAdhesion,
    insertarInteresado,
    listarInteresados,
    listarInteresado,
    eliminarInteresado,
    eliminarRequirementStrategies,
    insertarRequirementStrategies,
    modificarInteresados
};
