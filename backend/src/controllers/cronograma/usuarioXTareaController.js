const connection = require("../../config/db");

async function funcCrearUsuariosXTarea(usuarios, idTarea) {
    if (usuarios) {
        for (const usuario of usuarios) {
            await funcCrear(usuario.idUsuario, idTarea);
        }
    }
}

async function funcEliminarUsuariosXTarea(usuarios, idTarea) {
    if (usuarios) {
        const query = `CALL ELIMINAR_USUARIOS_X_TAREA(?);`;
        await connection.query(query, [idTarea]);
    }
}

async function funcCrear(idUsuario, idTarea) {
    try {
        const query = `CALL INSERTAR_USUARIO_X_TAREA(?,?);`;
        await connection.query(query, [idUsuario, idTarea]);
    } catch (error) {
        console.log(error);
    }
}

async function funcEliminar(idUsuario, idTarea) {
    try {
        const query = `CALL INSERTAR_USUARIO_X_TAREA(?,?);`;
        await connection.query(query, [idUsuario, idTarea]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    funcCrear,
    funcCrearUsuariosXTarea,
    funcEliminarUsuariosXTarea,
    funcEliminar
};
