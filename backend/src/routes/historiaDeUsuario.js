const express = require('express');
const connection = require('../config/db');
const {verifyToken} = require('../middleware/middlewares');

const routerHistoriaDeUsuario = express.Router();

routerHistoriaDeUsuario.post("/eliminarHistoria",verifyToken,async(req,res)=>{

    const idHU = req.body.idHistoriaDeUsuario;
        //Insertar query aca
    const query = `
        CALL ELIMINAR_HISTORIA_DE_USUARIO(?);
    `;
    try {
        const [results] = await connection.query(query,[idHU]);
        res.status(200).json({
            HU: results[0],
            message: "Historia de usuario eliminada correctamente"
        });
        console.log(`Se ha eliminado la historia de usuario ${idHU}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al eliminar historia de usuario:", error);
        res.status(500).send("Error al eliminar historia de usuario: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/insertarRequisitoFuncional",verifyToken,async(req,res)=>{

    const {idHistoriaDeUsuario,descripcion} = req.body;
        //Insertar query aca
    const query = `
        CALL INSERTAR_HISTORIA_REQUISITO(?,?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaDeUsuario,descripcion]);
        res.status(200).json({
            idRequisitoFuncional: results[0],
            message: "Requisito agregado correctamente"
        });
        console.log(`Se ha agregado el requisito funcional ${idRequisitoFuncional}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al agregar el requisito funcional:", error);
        res.status(500).send("Error al agregar el requisito funcional: " + error.message);
    }
})



routerHistoriaDeUsuario.get("/:idHistoriaDeUsuario/detallesHistoria",verifyToken, async (req, res) => {

    const { idHistoriaDeUsuario} = req.params;
    console.log(`Llegue a recibir solicitud listar HU${idHistoriaDeUsuario}`);
    const query = `
        CALL LISTAR_HISTORIA_DE_USUARIO_DETALLES(?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaDeUsuario]);
        res.status(200).json({
            historiaDeUsuario: results[0],
            message: "Historia obtenida exitosamente"
        });
        console.log(`Se han listado la historia de usuario ${idHistoriaDeUsuario}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al obtener la historia de usuario:", error);
        res.status(500).send("Error al obtener la historia de usuario: " + error.message);
    }

});

routerHistoriaDeUsuario.get("/test/:testId", (req, res) => {
    res.send(req.params);
});

routerHistoriaDeUsuario.get("/listarHistoriasEstado",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud listar Historias Estado");
    const query = `
        CALL LISTAR_HISTORIAS_ESTADO;
    `;
    try {
        const [results] = await connection.query(query);
        res.status(200).json({
            historiasEstado: results[0],
            message: "Historias estado obtenidos exitosamente"
        });
        console.log('Si se listarion los estados de las historias');
    } catch (error) {
        console.error("Error al obtener las historias estado:", error);
        res.status(500).send("Error al obtener las historias estado: " + error.message);
    }
})

routerHistoriaDeUsuario.get("/listarHistoriasPrioridad",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud listar Historias Prioridad");
    const query = `
        CALL LISTAR_HISTORIAS_PRIORIDAD;
    `;
    try {
        const [results] = await connection.query(query);
        res.status(200).json({
            historiasPrioridad: results[0],
            message: "Historias prioridad obtenidos exitosamente"
        });
        console.log('Si se listaron las prioridades de las historias');
    } catch (error) {
        console.error("Error al obtener las historias prioridad:", error);
        res.status(500).send("Error al obtener las historias prioridad: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/insertarHistoriaDeUsuario",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de insertar una historia de usuario");
    //Insertar query aca
    const {idEpic,idPriority,idState,name,como,quiero,para,idUsuarioCreador,requirementData,scenarioData} = req.body;
    console.log("Llegue a recibir solicitud de insertar una historia de usuario");
    const query = `
        CALL INSERTAR_HISTORIA_DE_USUARIO(?,?,?,?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idEpic, idPriority, idState, name, como, 
            quiero, para,idUsuarioCreador]);
        const idHU = results[0][0].idHistoriaDeUsuario;
        console.log(`Se inserto la HU ${idHU}!`);
        // Iteracion Escenario
        for (const scenario of scenarioData) {
            const [scenarioRows] = await connection.execute(`
            CALL INSERTAR_HISTORIA_CRITERIO(
                ${idHU},
                '${scenario.dadoQue}',
                '${scenario.cuando}',
                '${scenario.entonces}',
                '${scenario.scenario}'
            );
            `);
            const idHistoriaCriterioDeAceptacion = scenarioRows[0][0].idHistoriaCriterioDeAceptacion;
            console.log(`Se insertó el criterio de aceptacion: ${idHistoriaCriterioDeAceptacion}`);
        }
        for (const requerimiento of requirementData) {
            const [requerimientoRows] = await connection.execute(`
            CALL INSERTAR_HISTORIA_REQUISITO(
                ${idHU},
                '${requerimiento.requirement}'
            );
            `);
            const idHistoriaRequisito  = requerimientoRows[0][0].idHistoriaRequisito;
            console.log(`Se insertó el requisito: ${idHistoriaRequisito}`);
        }
        res.status(200).json({
            idHU,
            message: "HU insertado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerHistoriaDeUsuario.get("/:idHistoriaDeUsuario/listarHistoriaDeUsuario",verifyToken, async (req, res) => {
    console.log("Llegue a recibir solicitud listar HU");
    const { idHistoriaDeUsuario} = req.params;
    const query = `
        CALL LISTAR_HU_X_ID(?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaDeUsuario]);
        console.log(results[0]);
        const [criterioAceptacionData] = await connection.execute(`
            CALL LISTAR_CRITERIO_X_IDHU(${idHistoriaDeUsuario});
        `);
        const [requirimientosData] = await connection.execute(`
            CALL LISTAR_REQUERIMIENTO_X_IDHU(${idHistoriaDeUsuario});
        `);
        const historiaUsuario = {
            hu: results[0],
            criteriosAceptacion: criterioAceptacionData[0],
            requirimientos: requirimientosData[0]
        };
        res.status(200).json({
            historiaUsuario,
            message: "HU obtenido exitosamente"
        });
        console.log('Si se listo HU');
    } catch (error) {
        console.error("Error al obtener HU:", error);
        res.status(500).send("Error al obtener HU: " + error.message);
    }
})

routerHistoriaDeUsuario.put("/modificarHistoriaDeUsuario",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de modificar una historia de usuario");
    //Insertar query aca
    const {idHistoriaUsuario,idEpic,idPriority,idState,name,como,quiero,para,requirementData,scenarioData} = req.body;
    console.log("Llegue a recibir solicitud de modificar una historia de usuario");
    const query = `
        CALL MODIFICAR_HISTORIA_DE_USUARIO(?,?,?,?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaUsuario,idEpic, idPriority, idState, name, como, 
            quiero, para]);
        const idHU = results[0][0].idHistoriaDeUsuario;
        console.log(`Se modifico la HU ${idHU}!`);
        // Iteracion Escenario
        for (const scenario of scenarioData) {
            const [scenarioRows] = await connection.execute(`
            CALL MODIFICAR_HISTORIA_CRITERIO(
                ${idHU},
                ${scenario.idHistoriaCriterioDeAceptacion},
                '${scenario.dadoQue}',
                '${scenario.cuando}',
                '${scenario.entonces}',
                '${scenario.scenario}'
            );
            `);
            const idHistoriaCriterioDeAceptacion = scenarioRows[0][0].idHistoriaCriterioDeAceptacion;
            console.log(`Se modificó el criterio de aceptacion: ${idHistoriaCriterioDeAceptacion}`);
        }
        for (const requerimiento of requirementData) {
            const [requerimientoRows] = await connection.execute(`
            CALL MODIFICAR_HISTORIA_REQUISITO(
                ${idHU},
                ${requerimiento.idHistoriaRequisito},
                '${requerimiento.requirement}'
            );
            `);
            const idHistoriaRequisito  = requerimientoRows[0][0].idHistoriaRequisito;
            console.log(`Se modificó el requisito: ${idHistoriaRequisito}`);
        }
        res.status(200).json({
            idHU,
            message: "HU modificó exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerHistoriaDeUsuario.delete("/eliminarEpica",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de eliminar Epica");
    //Insertar query aca
    const {nombreEpica} = req.body;
    const query = `
        CALL ELIMINAR_EPICA_NOMBRE(?);
    `;
    try {
        const [results] = await connection.query(query,[nombreEpica]);
        const nombre = results[0][0].nombre;
        console.log(`Se elimino la épica ${nombre}!`);
        res.status(200).json({
            nombre,
            message: "Épica eliminada exitosamente",
        });
    } catch (error) {
        console.error("Error al la épica:", error);
        res.status(500).send("Error al eliminar: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/listarProductBacklog",verifyToken,async(req,res)=>{
    const {idProyecto} = req.body;
    console.log(`Llegue a recibir solicitud listar backlog con id de Proyecto :  ${idProyecto}`);
    const query = `
        CALL LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query,idProyecto);
        res.status(200).json({
            backlog: results[0],
            message: "Backlog obtenido exitosamente"
        });
        console.log(`Se han listado el backlog para el proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/insertarEpica",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de insertar Epica");
    //Insertar query aca
    const {idProductBacklog, nombre} = req.body;
    const query = `
        CALL INSERTAR_EPICA(?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProductBacklog,nombre]);
        const idEpica = results[0][0].idEpica;
        console.log(`Se insertó la épica ${idEpica}!`);
        res.status(200).json({
            idEpica,
            message: "Épica insertada exitosamente",
        });
    } catch (error) {
        console.error("Error al insertar épica:", error);
        res.status(500).send("Error al insertar: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/insertarHUCriterioAceptacion",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de insertar Criterio Aceptacion");
    //Insertar query aca
    const {idHistoriaDeUsuario, dadoQue, cuando, entonces, escenario} = req.body;
    const query = `
        CALL INSERTAR_HU_CRITERIO_ACEPTACION(?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaDeUsuario,dadoQue,cuando,entonces,escenario]);
        const idHistoriaCriterioDeAceptacion = results[0][0].idHistoriaCriterioDeAceptacion;
        console.log(`Se insertó el criterio ${idHistoriaCriterioDeAceptacion}!`);
        res.status(200).json({
            idHistoriaCriterioDeAceptacion,
            message: "Criterio Aceptacion insertada exitosamente",
        });
    } catch (error) {
        console.error("Error al insertar Criterio Aceptacion:", error);
        res.status(500).send("Error al insertar: " + error.message);
    }
})

routerHistoriaDeUsuario.delete("/eliminarHUCriterioAceptacion",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de eliminar Criterio Aceptacion");
    //Insertar query aca
    const {idHistoriaCriterioDeAceptacion} = req.body;
    const query = `
        CALL ELIMINAR_HU_CRITERIO_ACEPTACION(?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaCriterioDeAceptacion]);
        const id = results[0][0].idHistoriaCriterioDeAceptacion;
        console.log(`Se elimino el Criterio Aceptacion ${id}!`);
        res.status(200).json({
            id,
            message: "Criterio Aceptacion eliminada exitosamente",
        });
    } catch (error) {
        console.error("Error al la Criterio Aceptacion:", error);
        res.status(500).send("Error al eliminar: " + error.message);
    }
})

routerHistoriaDeUsuario.post("/insertarHURequisito",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de insertar Requisito");
    //Insertar query aca
    const {idHistoriaDeUsuario, descripcion} = req.body;
    const query = `
        CALL INSERTAR_HU_REQUISITO(?,?;
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaDeUsuario,descripcion]);
        const idHistoriaRequisito = results[0][0].idHistoriaRequisito;
        console.log(`Se insertó el Requisito ${idHistoriaRequisito}!`);
        res.status(200).json({
            idHistoriaRequisito,
            message: "Requisito insertada exitosamente",
        });
    } catch (error) {
        console.error("Error al insertar Requisito:", error);
        res.status(500).send("Error al insertar: " + error.message);
    }
})

routerHistoriaDeUsuario.delete("/eliminarHURequisito",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de eliminar Requisito");
    //Insertar query aca
    const {idHistoriaRequisito} = req.body;
    const query = `
        CALL ELIMINAR_HU_REQUISITO(?);
    `;
    try {
        const [results] = await connection.query(query,[idHistoriaRequisito]);
        const id = results[0][0].idHistoriaRequisito;
        console.log(`Se elimino el Requisito ${id}!`);
        res.status(200).json({
            id,
            message: "Requisito eliminada exitosamente",
        });
    } catch (error) {
        console.error("Error al Requisito:", error);
        res.status(500).send("Error al eliminar: " + error.message);
    }
})

//Eliminar Criterio de Aceptacion y Requisito
routerHistoriaDeUsuario.delete("/eliminarCriterioRequisito",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de eliminar Criterio de Aceptacion y Requisito");
    //Insertar query aca
    const {scenarioData,requirementData} = req.body;
    try {
        // Iteracion Eliminar Criterio de Aceptacion
        for (const scenario of scenarioData) {
            await connection.execute(`
            CALL ELIMINAR_HU_CRITERIO_ACEPTACION(${scenario.idHistoriaCriterioDeAceptacion});
            `);
            console.log(`Se logró eliminar el criterio de aceptacion: ${scenario.idHistoriaCriterioDeAceptacion}`);
        }
        // Iteracion Eliminar Criterio de Aceptacion
        for (const requerimiento of requirementData) {
            await connection.execute(`
            CALL ELIMINAR_HU_REQUISITO(${requerimiento.idHistoriaRequisito});
            `);
            console.log(`Se elimino el requisito: ${requerimiento.idHistoriaRequisito}`);
        }
        res.status(200).json({
            message: "Criterios de Aceptacion y Requisitos eliminados exitosamente"
        });
    } catch (error) {
        console.error("Error en la eliminacion:", error);
        res.status(500).send("Error en la eliminacion: " + error.message);
    }
})

module.exports.routerHistoriaDeUsuario = routerHistoriaDeUsuario;