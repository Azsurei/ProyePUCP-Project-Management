const express = require("express");
const connection = require("../config/db");
const { verifyToken } = require("../middleware/middlewares");

const routerUsuario = express.Router();

routerUsuario.post("/listarUsuarios", verifyToken, async (req, res) => {
    const { nombreCorreo } = req.body;
    //Insertar query aca
    console.log("Llegue a recibir solicitud listar usuariosXnombreCorreo");
    const query = `
        CALL LISTAR_USUARIOS_X_NOMBRE_CORREO(?);
    `;
    try {
        const [results] = await connection.query(query, [nombreCorreo]);
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios obtenidos exitosamente",
        });
        console.log(results);
        console.log("Si se listaron los usuarios");
        console.log(results[0]);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).send("Error al obtener los usuarios: " + error.message);
    }
});

routerUsuario.get("/verInfoUsuario", verifyToken, async (req, res) => {
    const idUsuario = req.user.id;

    //Insertar query aca
    console.log("Llegue a recibir solicitud ver informacion de tu usuario");
    const query = `
        CALL LISTAR_USUARIO_X_ID_USUARIO(?);
    `;
    try {
        const [results] = await connection.query(query, [idUsuario]);
        res.status(200).json({
            usuario: results[0],
            message: "Info de usuario obtenida exitosamente",
        });
    } catch (error) {
        console.error("Error al obtener info del usuario:", error);
        res.status(500).send(
            "Error al obtener info del usuario: " + error.message
        );
    }
});

routerUsuario.post("/verRolUsuarioEnProyecto", verifyToken, async (req,res) => {
    const {idUsuario, idProyecto} = req.body;

    console.log("Llegue a recibir solicitud ver rol de tu usuario en proyecto=================================================");
    const query = `
        CALL LISTAR_ROL_X_IDUSUARIO_IDPROYECTO(?,?);
    `;
    try {
        const [results] = await connection.query(query, [idUsuario, idProyecto]);
        res.status(200).json({
            rol: results[0][0],
            message: "Rol de usuario obtenido exitosamente",
        });
    } catch (error) {
        console.error("Error al obtener rol del usuario:", error);
        res.status(500).send(
            "Error al obtener rol del usuario: " + error.message
        );
    }
});

routerUsuario.post(
    "/insertarUsuariosAProyecto",
    verifyToken,
    async (req, res) => {
        //Insertar query aca
        const { users, idProyecto } = req.body;

        //users debe tener atributos idUsuario y numRol (3=miembro)

        console.log("Llegue a recibir insertar usuario por rol en proyecto ");
        const query = `
        CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
        `;
        try {
            for (const user of users) {
                const [results] = await connection.query(query, [
                    user.idUsuario,
                    user.numRol,
                    idProyecto,
                ]);

                const idUsuarioXRolProyecto = results[0][0].idUsuarioXRolProyecto;
                console.log(
                    `Se agrego el usuario ${participante.id} al proyecto ${idProyecto} con el rol ${user.numRol}`
                );
            }

            res.status(200).json({
                message: "Usuarios registrados exitosamente",
            });
        } catch (error) {
            console.error(
                "Error en el registro de usuario por rol en proyecto:",
                error
            );
            res.status(459).send(
                "Error en el registro de usuario por rol en proyecto:" +
                    error.message
            );
        }
    }
);

module.exports.routerUsuario = routerUsuario;
