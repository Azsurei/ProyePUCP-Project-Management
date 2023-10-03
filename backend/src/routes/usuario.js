const express = require('express');
const connection = require('../config/db');
const routerUsuario = express.Router();

routerUsuario.post("/listarUsuarios",async(req,res)=>{
    //const { tokenProyePUCP } = req.cookies;
    try{
        //const payload = jwt.verify(tokenProyePUCP, secret);
        //console.log(payload);
        const { nombreCorreo} = req.body;
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
            console.log('Si se listaron los usuarios');
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).send("Error al obtener los usuarios: " + error.message);
        }
    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})

module.exports.routerUsuario = routerUsuario;