const connection = require("../../config/db");

async function insertarEquipoYParticipantes(req, res, next) {
    //Insertar query aca
    const {idProyecto,nombre,idLider,usuarios} = req.body;
    console.log("Llegue a recibir solicitud insertar componente edt");
    const query = `
        CALL INSERTAR_EQUIPO(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto, nombre, idLider]);
        const idEquipo = results[0][0].idEquipo;
        console.log(`Se creo el equipo${idEquipo}!`);
        // Iteracion
        for (const usuario of usuarios) {
            if (usuario.data !== "") {
                const [usuarioXEquipoRows] = await connection.execute(`
                CALL INSERTAR_USUARIO_X_EQUIPO(
                    ${usuario.idUsuario},
                    '${idEquipo}'
                );
                `);
                const idUsuarioXEquipo =
                    usuarioXEquipoRows[0][0].idUsuarioXEquipo;
                console.log(
                    `Se insertó el usuario ${usuario.idUsuario} en el equipo ${idEquipo}`
                );
            }
        }
        res.status(200).json({
            idEquipo,
            message: "Equipo insertado exitosamente",
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
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
    const query = `CALL LISTAR_EQUIPOS_X_IDPROYECTO(?);`;
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

async function insertarRol(req,res,next){
    const{idEquipo, nombreRol} = req.body;
    const query = `CALL INSERTAR_ROL_EQUIPO(?,?);`;
    try {
        const [results] = await connection.query(query, [idEquipo,nombreRol]);
        const idRolEquipo = results[0].idRolEquipo;
        console.log(`Se insertó el rol ${idRolEquipo}!`);
        res.status(200).json({
            idRolEquipo,
            message: "Rol insertada exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

async function listarRol(req,res,next){
    const{idEquipo} = req.params;
    const query = `CALL LISTAR_ROL_EQUIPO(?);`;
    try {
        const [results] = await connection.query(query, [idEquipo]);
        const roles = results[0];
        console.log(`Se listaron los roles ${roles}!`);
        res.status(200).json({
            roles,
            message: "Roles listados exitosamente"
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
    listarRol
};
