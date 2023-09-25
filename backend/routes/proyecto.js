const express = require('express');
const connection = require('../config/db');
const routherProyecto = express.Router();

routherProyecto.post("/",async(req,res)=>{
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

module.exports.routerProyecto = routerProyecto;