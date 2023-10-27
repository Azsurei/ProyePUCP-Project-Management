const express = require("express");
const routerAdmin = express.Router();
const connection = require('../config/db');
const { verifyToken } = require("../middleware/middlewares");

routerAdmin.get("/listarUsuariosConPrivilegios",async(req,res)=>{

    console.log("Llegue a recibir solicitud de listar usuarios con privilegios");

    const query = `
        CALL LISTAR_USUARIOS_CON_PRIVILEGIOS();
    `;
    try {
        const [results] = await connection.query(query, []);
        console.log(results[0]);

        res.status(200).json({
            usuariosPriv: results[0],
            message: "Usuarios con privilegios listados correctamente",
        });
    } catch (error) {
        console.error("Error al obtener usuarios: ", error);
        res.status(500).send(
            "Error al obtener usuarios: " + error.message
        );
    }
})

module.exports.routerAdmin = routerAdmin;