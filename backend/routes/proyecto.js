const express = require('express');
const connection = require('../config/db');
const routerProyecto = express.Router();

routerProyecto.post("/",async(req,res)=>{
    const { nombre, maxCantParticipantes,fechaInicio,fechaFin,fechaUltimaModificacion } = req.body;
    console.log("Llegue a recibir solicitud creacion proyecto");
    const query = `
        CALL INSERTAR_PROYECTO('${nombre}', '${maxCantParticipantes}, '${fechaInicio}, '${fechaFin}', '${fechaUltimaModificacion}');
    `;
    try {
        const [results] = await connection.query(query);
        const idProyecto = results[0][0].idUsuario;
        res.status(200).json({
            idProyecto,
            message: "Proyecto registrado exitosamente",
            
        });
        console.log(`Se creo el proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

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