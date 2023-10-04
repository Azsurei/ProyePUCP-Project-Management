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

module.exports.routerHistoriaDeUsuario = routerHistoriaDeUsuario;