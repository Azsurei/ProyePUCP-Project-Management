const express = require('express');
const connection = require('../config/db');
const routerProyecto = express.Router();

const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";




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

routerProyecto.get("/listarProyectos",async(req,res)=>{
    console.log("Llegue a recibir solicitud listar proyecto");


    const { tokenProyePUCP } = req.cookies;

    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;

        
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

    }catch(error){
        return res.status(401).send(error.message + "invalid tokenProyePUCP token");
    }

    
})

module.exports.routerProyecto = routerProyecto;