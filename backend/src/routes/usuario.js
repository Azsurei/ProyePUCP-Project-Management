const express = require('express');
const connection = require('../config/db');
const {verifyToken} = require('../middleware/middlewares');

const routerUsuario = express.Router();

routerUsuario.post("/listarUsuarios",verifyToken,async(req,res)=>{
    const {nombreCorreo} = req.body;
    //Insertar query aca
    console.log("Llegue a recibir solicitud listar usuariosXnombreCorreo");
    const query = `
        CALL LISTAR_USUARIOS_X_NOMBRE_CORREO(?);
    `;
    try {
        const [results] = await connection.query(query,[nombreCorreo]);
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios obtenidos exitosamente"
        });
        console.log(results);
        console.log('Si se listaron los usuarios');
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).send("Error al obtener los usuarios: " + error.message);
    }
})

routerUsuario.get("/verInfoUsuario",verifyToken,async(req,res)=>{
    const idUsuario = req.user.id;

    //Insertar query aca
    console.log("Llegue a recibir solicitud ver informacion de tu usuario");
    const query = `
        CALL LISTAR_USUARIO_X_ID_USUARIO(?);
    `;
    try {
        const [results] = await connection.query(query,[idUsuario]);
        res.status(200).json({
            usuario: results[0],
            message: "Info de usuario obtenida exitosamente"
        });
    } catch (error) {
        console.error("Error al obtener info del usuario:", error);
        res.status(500).send("Error al obtener info del usuario: " + error.message);
    }
})

module.exports.routerUsuario = routerUsuario;