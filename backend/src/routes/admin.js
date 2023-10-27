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
});

routerAdmin.put("/cambiarPrivilegioUsuario",async(req,res)=>{

    console.log("Llegue a recibir solicitud de cambiar usuarios con privilegios");

    const { idUsuario, idPrivilegio } = req.body;

    const query = `
        CALL ACTUALIZAR_PRIVILEGIO_X_IDUSUARIO(?,?);
    `;
    try {
        const [results] = await connection.query(query, [idUsuario,idPrivilegio]);
        console.log(results[0]);

        res.status(200).json({
            usuario: results[0],
            message: "Usuarios modificado correctamente",
        });
    } catch (error) {
        console.error("Error al modificar usuario: ", error);
        res.status(500).send(
            "Error al modificar usuario: " + error.message
        );
    }
})

module.exports.routerAdmin = routerAdmin;