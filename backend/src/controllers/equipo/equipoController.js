const connection = require("../../config/db");

async function insertarEquipoYParticipantes(req, res, next) {
    //Insertar query aca
    const { idProyecto, nombre, roles, usuariosXRol } = req.body;
    const query = `CALL INSERTAR_EQUIPO(?,?);`;
    try {
        const [results] = await connection.query(query, [idProyecto, nombre]);
        const idEquipo = results[0][0].idEquipo;
        console.log(`Se creo el equipo${idEquipo}!`);

        // Iteracion para insertar los roles y los usuarios asociados a ese rol
        roles.sort((a, b) => a.idRol - b.idRol); //ordenamos para buena vista en selects
        const query2 = `CALL INSERTAR_ROL_EQUIPO(?);`;
        for (const rol of roles) {
            //insertamos los roles en RolEquipo
            let idRolEquipo;
            if (rol.idRol !== 1 && rol.idRol !== 2) {
                const [results1] = await connection.query(query2, [
                    rol.nombreRol,
                ]);
                idRolEquipo = results1[0][0].idRolEquipo;
                console.log(`Se insertó el rol ${idRolEquipo}!`);
            } else {
                idRolEquipo = rol.idRol;
            }

            //insertamos los roles en EquipoXRolEquipo (Se conservan roles no asignados pero creados)
            const query3 = `CALL INSERTAR_EQUIPO_X_ROLEQUIPO(?,?);`;
            const [results2] = await connection.query(query3, [
                idEquipo,
                idRolEquipo,
            ]);
            const idEquipoXRolEquipo = results2[0].idEquipoXRolEquipo;

            //insertamos todos los usuarios asignados al idRolEquipo en UsuarioXEquipoXRol
            const query4 = `CALL INSERTAR_USUARIO_X_EQUIPO_X_ROL(?,?,?);`;
            console.log(`Filtrando usuarios para rol en db ${idRolEquipo}! / en front ${rol.idRol}`)
            const filteredUsuarios = usuariosXRol.filter(
                (item) => item.idRolEquipo === rol.idRol
            );
            for (const usuario of filteredUsuarios) {
                const [results3] = await connection.query(query4, [
                    usuario.idUsuario,
                    idEquipo,
                    idRolEquipo,
                ]);
                const idUsuarioXEquipoXRolEquipo = results3[0][0].idUsuarioXEquipoXRolEquipo;
                console.log(`Se insertó el usuario ${usuario.idUsuario} con rol ${idRolEquipo}!`);
            }
        }
        res.status(200).json({
            idEquipo,
            message: "Equipo insertado exitosamente, junto con sus roles y usuarios asignados",
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
        next(error);
    }
}



async function listarXIdProyecto(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_EQUIPO_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query, [idProyecto]);
        equipos = results[0];

        res.status(200).json({
            equipos,
            message: "Equipos listadas correctamente",
        });
    } catch (error) {
        next(error);
    }
}



async function listarEquiposYParticipantes(req, res, next) {
    const { idProyecto } = req.params;
    const query = `CALL LISTAR_EQUIPO_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        const equipos = results[0];
        for (const equipo of equipos) {
            const query1 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
            const [participantes] = await connection.query(query1, [
                equipo.idEquipo,
            ]);
            equipo.participantes = participantes[0];
        }

        //falta fetchear tareas totales y tareas completadas para propositos de la pantalla


        res.status(200).json({
            equipos,
            message: "Equipos obtenidos exitosamente",
        });
        console.log("Se listaron los equipos correctamente");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarTareasDeXIdEquipo(req, res, next) {
    const { idEquipo } = req.params;
    const query = `CALL LISTAR_TAREAS_X_IDEQUIPO(?);`;
    try {
        const [results] = await connection.query(query, [idEquipo]);
        const tareasEquipo = results[0];

        for (const tarea of tareasEquipo) {
            const query2 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
            const [usuarios] = await connection.query(query2, [tarea.idTarea]);
            tarea.usuarios = usuarios[0];
        }

        res.status(200).json({
            tareasEquipo,
            message: "Tareas de equipo " + idEquipo + " obtenidas exitosamente",
        });
        console.log("Se listaron las tareas correctamente");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function insertarRol(req, res, next) {
    const { idEquipo, nombreRol } = req.body;
    const query = `CALL INSERTAR_ROL_EQUIPO(?,?);`;
    try {
        const [results] = await connection.query(query, [idEquipo, nombreRol]);
        const idRolEquipo = results[0].idRolEquipo;
        console.log(`Se insertó el rol ${idRolEquipo}!`);
        res.status(200).json({
            idRolEquipo,
            message: "Rol insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarRol(req, res, next) {
    const { idEquipo } = req.params;
    const query = `CALL LISTAR_ROL_EQUIPO(?);`;
    try {
        const [results] = await connection.query(query, [idEquipo]);
        const roles = results[0];
        console.log(`Se listaron los roles ${roles}!`);
        res.status(200).json({
            roles,
            message: "Roles listados exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarRol(req, res, next) {
    const { idRolEquipo } = req.body;
    const query = `CALL ELIMINAR_ROL_EQUIPO(?);`;
    try {
        await connection.query(query, [idRolEquipo]);
        console.log(`Se elimino el rol ${idRolEquipo}!`);
        res.status(200).json({
            message: "Rol eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function insertarEquipo(req, res, next) {
    const { idProyecto, nombre, idLider } = req.body;
    const query = `CALL INSERTAR_NUEVO_EQUIPO(?,?,?);`;
    try {
        const [results] = await connection.query(query, [
            idProyecto,
            nombre,
            idLider,
        ]);
        const idEquipo = results[0][0].idEquipo;
        console.log(`Se insertó el equipo ${idEquipo}!`);
        res.status(200).json({
            idEquipo,
            message: "Equipo insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function insertarMiembros(req, res, next) {
    const { idEquipo, miembros } = req.body;
    const query = `CALL INSERTAR_MIEMBROS_EQUIPO(?,?,?);`;
    try {
        for (const miembro of miembros) {
            const [results] = await connection.query(query, [
                idEquipo,
                miembro.idUsuario,
                miembro.idRolEquipo,
            ]);
            const idUsuarioXEquipo = results[0][0].idUsuarioXEquipo;
            console.log(`Se insertó el miembro ${idUsuarioXEquipo}!`);
        }
        res.status(200).json({
            message: "Miembros insertados exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarEquipo(req, res, next) {
    const { idEquipo } = req.body;
    const query = `CALL ELIMINAR_EQUIPO_X_IDEQUIPO(?);`;
    try {
        await connection.query(query, [idEquipo]);
        console.log(`Se elimino el equipo ${idEquipo}!`);
        res.status(200).json({
            message: "Equipo eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function modificarMiembroEquipo(req, res, next) {
    const { idEquipo, miembrosModificados } = req.body;
    const query = `CALL MODIFICAR_MIEMBRO_EQUIPO(?,?,?);`;
    try {
        for (const miembro of miembrosModificados) {
            await connection.query(query, [
                idEquipo,
                miembro.idUsuario,
                miembro.idRol,
            ]);
            console.log(`Se modifico el miembro ${miembro.idUsuario}!`);
        }
        res.status(200).json({
            message: "Miembro modificado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarMiembroEquipo(req, res, next) {
    const { idEquipo, miembrosEliminados } = req.body;
    const query = `CALL ELIMINAR_MIEMBRO_EQUIPO(?,?);`;
    try {
        for (const miembro of miembrosEliminados) {
            await connection.query(query, [idEquipo, miembro.idUsuario]);
            console.log(`Se elimino el miembro ${miembro.idUsuario}!`);
        }
        res.status(200).json({
            message: "Miembro eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function insertarMiembrosEquipo(req, res, next) {
    const { idEquipo, miembros } = req.body;
    const query = `CALL INSERTAR_MIEMBROS_EQUIPO(?,?,?);`;
    try {
        for (const miembro of miembros) {
            const [results] = await connection.query(query, [
                idEquipo,
                miembro.idUsuario,
                miembro.idRol,
            ]);
            const idUsuarioXEquipo = results[0][0].idUsuarioXEquipo;
            console.log(`Se insertó el miembro ${idUsuarioXEquipo}!`);
        }
        res.status(200).json({
            message: "Miembros insertados exitosamente",
        });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    insertarEquipoYParticipantes,
    listarXIdProyecto,
    listarEquiposYParticipantes,
    listarTareasDeXIdEquipo,
    insertarRol,
    listarRol,
    eliminarRol,
    insertarEquipo,
    insertarMiembros,
    eliminarEquipo,
    modificarMiembroEquipo,
    eliminarMiembroEquipo,
    insertarMiembrosEquipo,
};
