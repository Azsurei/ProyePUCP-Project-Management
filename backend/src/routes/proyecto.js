const express = require('express');
const connection = require('../config/db');
const routerProyecto = express.Router();

const jwt = require("jsonwebtoken");

const secret = "oaiscmawiocnaoiwncioawniodnawoinda";


const routerEDT = require('./EDT').routerEDT;
const routerBacklog = require('./backlog').routerBacklog;

routerProyecto.use("/backlog",routerBacklog);
routerProyecto.use("/EDT",routerEDT);

routerProyecto.post("/insertarProyecto",async(req,res)=>{
    const { tokenProyePUCP } = req.cookies;
    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;
        //Insertar query aca
        const { nombre, maxCantParticipantes,fechaInicio,fechaFin } = req.body;
        console.log("Llegue a recibir solicitud creacion proyecto");
        const query = `
            CALL INSERTAR_PROYECTO(?,?,?,?,?);
        `;
        try {
            const [results] = await connection.query(query,[idUsuario,nombre,maxCantParticipantes,fechaInicio,fechaFin]);
            const idProyecto = results[0][0].idProyecto;
            res.status(200).json({
                idProyecto,
                message: "Proyecto registrado exitosamente",
                
            });
            console.log(`Se creo el proyecto ${idProyecto}!`);
        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).send("Error en el registro: " + error.message);
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



routerProyecto.get("/listarHistoriasEstado",async(req,res)=>{
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

routerProyecto.get("/listarHistoriasPrioridad",async(req,res)=>{
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