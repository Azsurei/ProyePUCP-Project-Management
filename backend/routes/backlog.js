const express = require('express');
const connection = require('../config/db');
const routerBacklog = express.Router();

routerProyecto.get("/:idUsuario",async(req,res)=>{
    const { idUsuario} = req.params;
    console.log("Llegue a recibir solicitud listar proyecto");
    const query = `
        CALL LISTAR_PROYECTOS_X_ID_USUARIO(?);
    `;
    try {
        const [results] = await connection.query(query,[idUsuario]);
        res.status(200).json({
            proyectos: results[0],
            message: "Proyectos obtenidos exitosamente"
            
        });
        console.log(`Se han listado los proyectos para el usuario ${idUsuario}!`);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
})


module.exports.routerProyecto = routerProyecto;