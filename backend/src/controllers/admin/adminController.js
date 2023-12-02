const connection = require("../../config/db");

async function listarUsuariosConPrivilegios(req, res, next) {
    console.log("Llegue a recibir solicitud de listar usuarios con privilegios");
    const query = `CALL LISTAR_USUARIOS_TODOS();`;
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
        next(error);
    }
}

async function cambiarPrivilegioUsuario(req, res, next) {
    console.log("Llegue a recibir solicitud de cambiar usuarios con privilegios");
    const { idUsuario, idPrivilegio } = req.body;
    const query = `CALL ACTUALIZAR_PRIVILEGIO_X_IDUSUARIO(?,?);`;

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
}

async function cambiarEstadoUsuario(req, res, next) {
    const { idUsuario } = req.body;
    const query = `CALL CAMBIAR_ESTADO_USUARIO(?);`;
    try {
        await connection.query(query, [idUsuario]);
        console.log(`Estado Activo del Usuario ${idUsuario} modificado`);
        res.status(200).json({
            message: "Estado Activo de Usuario cambiado exitosamente",
        });
    } catch (error) {
        console.error("Error al cambiar el estado del usuario: ", error);
        res.status(500).send(
            "Error al cambiar el estado del usuario: " + error.message
        );
    }
}



module.exports = {
    listarUsuariosConPrivilegios,
    cambiarPrivilegioUsuario,
    cambiarEstadoUsuario
};