const express = require('express');
const connection = require('../config/db');
const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";
const routerEDT = require('./EDT').routerEDT;
const routerBacklog = require('./backlog').routerBacklog;


const routerProyecto = express.Router();


routerProyecto.use("/backlog",routerBacklog);
routerProyecto.use("/EDT",routerEDT);

routerProyecto.post("/insertarProyecto",async(req,res)=>{
    const { tokenProyePUCP } = req.cookies;
    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;
        
        const { proyecto,herramientas,participantes } = req.body;
        
        console.log("Llegue a recibir solicitud creacion proyecto");
        
        let idProyecto;

        try {

            const query = `
            CALL INSERTAR_PROYECTO(?,?,?,?,?);
            `;

            const { nombre, maxCantParticipantes,fechaInicio,fechaFin } = proyecto;

            const [results] = await connection.query(query,[idUsuario,nombre,maxCantParticipantes,fechaInicio,fechaFin]);
            idProyecto = results[0][0].idProyecto;
            res.status(200).json({
                idProyecto,
                message: "Proyecto registrado exitosamente",
                
            });
            console.log(`Se creo el proyecto ${idProyecto}!`);
        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).send("Error en el registro: " + error.message);
        }

        try {
                for(const herramienta of herramientas){
                    const query = `
                        CALL INSERTAR_HERRAMIENTA_X_PROYECTO(?,?,?,?,?);
                    `;
                    const { idHerramienta, descripcion} = herramienta;

                    const [results] = await connection.query(query,[idHerramienta,descripcion]);
                    const idHerramientaXProyecto = results[0][0].idHerramientaXProyecto;

                    console.log(`Se creo el idHerramientaXProyecto ${idHerramientaXProyecto}!`);

                    if(descripcion=="EDT"){

                    }
                }
            } catch (error) {
                console.error("Error en el registro de herramientas X Proyecto:", error);
                res.status(500).send("Error en el registro de herramientas X proyecto: " + error.message);
            }

        try {
            const query = `
            CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
            `;
            for(const participante of participantes){
                const [results] = await connection.query(query,[participante.idUsuario,participante.idRol,participante.idProyecto]);
                const idUsuarioXRolProyecto = results[0][0].idProyecto;
                console.log(`Se agrego el usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}`);
            }
        } catch (error) {
            console.error(`Error en el registro del usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}`, error);
            res.status(500).send(`Error en el registro del usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}`+ error.message);
        }

    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})

routerProyecto.post("/insertarUsuarioXRolXProyecto",async(req,res)=>{
    const { tokenProyePUCP } = req.cookies;
    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;
        //Insertar query aca
        const { idRol, idProyecto} = req.body;
        console.log("Llegue a recibir insertar usuario por rol en proyecto ");
        const query = `
            CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
        `;
        try {
            const [results] = await connection.query(query,[idUsuario,idRol,idProyecto]);
            const idUsuarioXRolProyecto = results[0][0].idUsuarioXRolProyecto;
            res.status(200).json({
                idUsuarioXRolProyecto,
                message: "Usuario registrado en proyecto por rol",
            });
            console.log(`Se creo el proyecto ${idProyecto}!`);
        } catch (error) {
            console.error("Error en el registro de usuario por rol en proyecto:", error);
            res.status(500).send("Error en el registro de usuario por rol en proyecto:" + error.message);
        }
    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
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
            console.log(results[0]);
        } catch (error) {
            console.error("Error al obtener los proyectos:", error);
            res.status(500).send("Error al obtener los proyectos: " + error.message);
        }

    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})

routerProyecto.post("/listarProyectosPorNombre",async(req,res)=>{
    console.log("Llegue a recibir solicitud listar proyecto por nombre");
    //const { tokenProyePUCP } = req.cookies;

    try{
        //const payload = jwt.verify(tokenProyePUCP, secret);
        //console.log(payload);
        //const idUsuario = payload.user.id;
        const {nombre} = req.body;
        
        const query = `
            CALL LISTAR_PROYECTOS_X_NOMBRE(?);
        `;
        try {
            const [results] = await connection.query(query,[nombre]);
            res.status(200).json({
                proyectos: results[0],
                message: "Proyectos obtenidos exitosamente"
                
            });
            console.log(results[0]);
        } catch (error) {
            console.error("Error al obtener los proyectos:", error);
            res.status(500).send("Error al obtener los proyectos: " + error.message);
        }

    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})




routerProyecto.get("/:idProyecto/listarProyectoYGrupoDeProyecto",async(req,res)=>{
    const { tokenProyePUCP } = req.cookies;
    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        //Insertar query aca
        const {idProyecto} = req.params;
        console.log("Llegue a recibir solicitud listar Historias Prioridad");
        const query = `
            CALL LISTAR_PROYECTO_Y_GRUPO_DE_PROYECTO(?);
        `;
        try {
            const [results] = await connection.query(query,[idProyecto]);
            res.status(200).json({
                historiasPrioridad: results[0],
                message: "Historias prioridad obtenidos exitosamente"
            });
            console.log('Si se listarion las prioridades de las historias');
        } catch (error) {
            console.error("Error al obtener las historias prioridad:", error);
            res.status(500).send("Error al obtener las historias prioridad: " + error.message);
        }
    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})




module.exports.routerProyecto = routerProyecto;