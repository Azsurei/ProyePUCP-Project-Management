const connection = require("../../config/db");

async function listarUsuarios(req, res, next) {
    const { nombreCorreo } = req.body;
    //Insertar query aca
    console.log("Llegue a recibir solicitud listar usuariosXnombreCorreo");
    const query = `CALL LISTAR_USUARIOS_X_NOMBRE_CORREO(?);`;
    try {
        const [results] = await connection.query(query, [nombreCorreo]);
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios obtenidos exitosamente",
        });
        //console.log(results);
        console.log("Si se listaron los usuarios");
        //console.log(results[0]);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).send("Error al obtener los usuarios: " + error.message);
        next(error);
    }
}

async function verInfoUsuario(req, res, next) {
    const idUsuario = req.user.id;
    //Insertar query aca
    console.log("Llegue a recibir solicitud ver informacion de tu usuario");
    const query = `CALL LISTAR_USUARIO_X_ID_USUARIO(?);`;
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
        next(error);
    }
}

async function verRolUsuarioEnProyecto(req, res, next) {
    const { idUsuario, idProyecto } = req.body;

    console.log("Llegue a recibir solicitud ver rol de tu usuario en proyecto");
    const query = `CALL LISTAR_ROL_X_IDUSUARIO_IDPROYECTO(?,?);`;
    try {
        const [results] = await connection.query(query, [
            idUsuario,
            idProyecto,
        ]);
        res.status(200).json({
            rol: results[0][0],
            message: "Rol de usuario obtenido exitosamente",
        });
    } catch (error) {
        console.error("Error al obtener rol del usuario:", error);
        res.status(500).send(
            "Error al obtener rol del usuario: " + error.message
        );
        next(error);
    }
}

async function insertarUsuariosAProyecto(req, res, next) {
    //Insertar query aca
    const { users, idProyecto } = req.body;
    //users debe tener atributos idUsuario y numRol (3=miembro)
    console.log("Llegue a recibir insertar usuario por rol en proyecto ");
    const query = `CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);`;
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
            console.log("Usuario X Rol X Proyecto : ", idUsuarioXRolProyecto);
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

async function cambiarPassword(req, res, next) {
    const { correo, password } = req.body;
    try {
        const query = `CALL CAMBIAR_PASSWORD_CUENTA_USUARIO(?,?);`;
        await connection.query(query, [correo, password]);
        res.status(200).json({ message: `Password modificada` });
    } catch (error) {
        next(error);
    }
}

async function registrar(req, res, next) {
    const {
        nombres,
        apellidos,
        correoElectronico,
        password,
        tieneCuentaGoogle,
    } = req.body;
    console.log("Realizando registro de usuario...");

    const query = `CALL INSERTAR_CUENTA_USUARIO(?,?,?,?,?)`;
    try {
        const [results] = await connection.query(query, [
            nombres,
            apellidos,
            correoElectronico,
            password,
            tieneCuentaGoogle,
        ]);
        const idUsuario = results[0][0].idUsuario;
        res.status(200).json({
            idUsuario,
            message: "Usuario registrado exitosamente.",
        });
        console.log(`Usuario ${idUsuario} agregado a la base de datos`);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message:
                    "El correo electrónico ya está registrado. Por favor, utiliza uno diferente.",
            });
        } else {
            res.status(500).send("Error en el registro: " + error.message);
        }
        console.error("Error en el registro:", error);
    }
}

async function verificarSiCorreoEsDeGoogle(req, res, next) {
    const { correoElectronico } = req.body;
    try {
        const query = `CALL VERIFICAR_SI_CORREO_ES_DE_GOOGLE(?);`;
        const [results] = await connection.query(query, [correoElectronico]);
        console.log(results[0][0]);
        let tieneCuentaGoogle = results[0][0].tieneCuentaGoogle;
        console.log(tieneCuentaGoogle);
        if (tieneCuentaGoogle === 1) {
            tieneCuentaGoogle = true;
        } else {
            tieneCuentaGoogle = false;
        }
        res.status(200).json({
            tieneCuentaGoogle,
            message: "Se verificó si el correo es de google",
        });
    } catch (error) {
        next(error);
    }
}



async function enviarNotificacion(req, res, next) {
    const { idUsuario, tipo, idLineaAsociada } = req.body;
    console.log("enviando mensaje a usuario " + idUsuario);
    try {
        const query = `CALL INSERTAR_NOTIFICACION(?,?,?);`;
        const [results] = await connection.query(query, [idUsuario, tipo, idLineaAsociada]);
        
        res.status(200).json({
            message: "Se envio notificacion correctamente",
        });
    } catch (error) {
        next(error);
    }
}



async function listarNotificaciones(req, res, next) {
    const { idUsuario  } = req.body;
    console.log("Listando notificaciones de usuario " + idUsuario);
    try {
        const query = `CALL LISTAR_NOTIFICACION_X_ID_USUARIO(?);`;
        const [results] = await connection.query(query, [idUsuario]);

        const notificaciones = results[0];
        
        res.status(200).json({
            notificaciones,
            message: "Se envio notificacion correctamente",
        });
    } catch (error) {
        next(error);
    }
}

async function actualizaNotificacionAR(req, res, next){
    const {idOld, idNew} = req.body;
    try{
        const query = `CALL ACTUALIZA_ID_NOTIFICACION_AR(?,?);`;
        const [results] = await connection.query(query, [idOld, idNew]);
        
        res.status(200).json({
            message: "Se actualizo id de notificacion correctamente",
        });
    } catch (error) {
        next(error);
    }
}


async function modificaEstadoNotificacionXIdNotificacion(req, res, next){
    const {idNotificacion, estado} = req.body;
    try{
        const query = `CALL MODIFICAR_ESTADO_NOTIFICACION_X_ID_NOTIFICACION(?,?);`;
        const [results] = await connection.query(query, [idNotificacion, estado]);
        
        res.status(200).json({
            message: "Se actualizo estado de notificacion correctamente",
        });
    } catch (error) {
        next(error);
    }
}


async function modificaEstadoNotificacionXIdUsuario(req, res, next){
    const {idUsuario, estado} = req.body;
    try{
        const query = `CALL MODIFICAR_ESTADO_NOTIFICACION_X_ID_USUARIO(?,?);`;
        const [results] = await connection.query(query, [idUsuario, estado]);
        console.log(JSON.stringify(results,null,2));
        console.log("===================================");

        const notificaciones = results[0];
        console.log(JSON.stringify(notificaciones,null,2));
        res.status(200).json({
            notificaciones,
            message: "Se actualizo estado de notificaciones de usuario correctamente",
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    listarUsuarios,
    verInfoUsuario,
    verRolUsuarioEnProyecto,
    insertarUsuariosAProyecto,
    registrar,
    cambiarPassword,
    verificarSiCorreoEsDeGoogle,
    enviarNotificacion,
    listarNotificaciones,
    actualizaNotificacionAR,
    modificaEstadoNotificacionXIdNotificacion,
    modificaEstadoNotificacionXIdUsuario
};
