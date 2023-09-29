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

routerProyecto.get("/:idUsuario/:idProyecto/backlog",async(req,res)=>{
    const { idProyecto} = req.params;
    console.log("Llegue a recibir solicitud listar backlog");
    const query = `
        CALL LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({
            proyectos: results[0],
            message: "Backlog obtenido exitosamente"
        });
        console.log(`Se han listado el backlog para el proyecto ${idProyecto}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
})

routerProyecto.get("/:idUsuario/:idProyecto/:idBacklog/epica",async(req,res)=>{
    const { idBacklog} = req.params;
    console.log(`Llegue a recibir solicitud listar epicas de Backlog${idBacklog}`);
    const query = `
        CALL LISTAR_EPICAS_X_ID_BACKLOG(?);
    `;
    try {
        const [results] = await connection.query(query,[idBacklog]);
        res.status(200).json({
            proyectos: results[0],
            message: "Epicas obtenidas exitosamente"
        });
        console.log(`Se han listado las epicas para el Backlog ${idBacklog}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
})

routerProyecto.get("/:idUsuario/:idProyecto/:idEDT",async(req,res)=>{
    const {idEDT} = req.params;
    console.log(`Llegue a recibir solicitud listar EDT de Proyecto${idEDT}`);
    //AGREGAR ACA EL LISTADO
    const query = `
        CALL LISTAR_COMPONENTES_EDT_X_ID_EDT(?);
    `;
    try {
        const [results] = await connection.query(query,[idEDT]);
        res.status(200).json({
            EDT: results[0],
            message: "EDT obtenido exitosamente"
        });
        console.log(`Se han listado los componentes del EDT exitosamente${idEDT}!`);
        console.log(results);
    } catch (error) {
        console.error("Error al obtener los componentesEDT:", error);
        res.status(500).send("Error al obtener los componentesEDT: " + error.message);
    }
})

routerProyecto.get("/historiasEstado",async(req,res)=>{
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

routerProyecto.get("/historiasPrioridad",async(req,res)=>{
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
        console.log('Si se listarion las prioridades de las historias');
    } catch (error) {
        console.error("Error al obtener las historias prioridad:", error);
        res.status(500).send("Error al obtener las historias prioridad: " + error.message);
    }
})

module.exports.routerProyecto = routerProyecto;