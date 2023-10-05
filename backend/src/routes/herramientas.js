const express = require('express');
const connection = require('../config/db');
const routerHerramientas = express.Router();
const { verifyToken } = require('../middleware/middlewares');


routerHerramientas.get("/listarHerramientas",verifyToken,async(req,res)=>{

    console.log("Llegue a recibir solicitud listar Herramientas");
    const query = `
        CALL LISTAR_HERRAMIENTAS;
    `;
    try {
        const [results] = await connection.query(query);
        res.status(200).json({
            herramientas: results[0],
            message: "Herramientas obtenidas exitosamente"
        });
        console.log('Si se listarion las herramientas');
    } catch (error) {
        console.error("Error al obtener las herramientas:", error);
        res.status(500).send("Error al obtener las herramientas: " + error.message);
    }
})

routerHerramientas.get("/:idProyecto/listarHerramientasDeProyecto",verifyToken,async(req,res)=>{

    console.log("Llegue a recibir solicitud de listar las herramientas de un proyecto");

    const idProyecto = req.params.idProyecto;

    const query = `
        CALL LISTAR_HERRAMIENTAS_X_PROYECTO_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        console.log(results[0]);

        res.status(200).json({
            herramientas: results[0],
            message: "Herramientas de proyecto obtenidas exitosamente",
        });
        console.log(
            `Se han listado las herramientas para el proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener las herramientas del proyecto: ", error);
        res.status(500).send(
            "Error al obtener las herramientas del proyecto: " + error.message
        );
    }
})


module.exports.routerHerramientas = routerHerramientas;