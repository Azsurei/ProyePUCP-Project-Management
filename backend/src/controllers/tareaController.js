const connection = require("../config/db");

async function crear(req, res, next) {
    const {
        idCronograma,
        idTareaEstado,
        idSubGrupo,
        idPadre,
        idTareaAnterior,
        sumillaTarea,
        descripcion,
        fechaInicio,
        fechaFin,
        cantSubtareas,
        cantPosteriores,
        horasPlaneadas,
        usuarios,
        subTareas,
        tareasPosteriores,
    } = req.body;

    try {
        const idTarea = await insertarTarea(req.body);
        await insertarUsuarios(usuarios, idTarea);
        //await insertarTareas(subTareas);  --Ya no insertamos subTareas en esta seccion, se insertan como normales
        await insertarTareasPosteriores(tareasPosteriores, idTarea, req.body);

        res.status(200).json({ message: `Tarea ${idTarea} creada` });
    } catch (error) {
        next(error);
        console.log(error);
    }
}

async function insertarTarea(data) {
    const query = `CALL INSERTAR_TAREA(?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [results] = await connection.query(query, [
        data.idCronograma,
        data.idTareaEstado,
        data.idSubGrupo,
        data.idPadre,
        data.idTareaAnterior,
        data.sumillaTarea,
        data.descripcion,
        data.fechaInicio,
        data.fechaFin,
        data.cantSubtareas,
        data.cantPosteriores,
        data.horasPlaneadas,
    ]);
    return results[0][0].idTarea;
}

async function insertarUsuarios(usuarios, idTarea) {
    if (usuarios) {
        const query = `CALL INSERTAR_USUARIO_X_TAREA(?,?);`;
        for (const usuario of usuarios) {
            await connection.query(query, [usuario.idUsuario, idTarea]);
        }
    }
}


async function insertarTareasPosteriores(
    tareas,
    idTareaPrevia,
    originalTareaData
) {
    if (tareas) {
        for (const tarea of tareas) {
            const idTarea = await insertarTarea({
                idCronograma: originalTareaData.idCronograma,
                idTareaEstado: 1,
                idSubGrupo: originalTareaData.idSubGrupo,
                idPadre: null,
                idTareaAnterior: idTareaPrevia,
                sumillaTarea: tarea.sumillaTarea,
                descripcion: tarea.descripcion,
                fechaInicio: originalTareaData.fechaFin,
                fechaFin: tarea.fechaFin,
                cantSubtareas: 0,
                cantPosteriores: 0,
                horasPlaneadas: null,
                usuarios: originalTareaData.usuarios,
                subTareas: null,
                tareasPosteriores: null,
            });
            await insertarUsuarios(originalTareaData.usuarios, idTarea);
        }
    }
}

async function listarXIdProyecto(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_PROYECTO(?);`;
        const [resultsTareas] = await connection.query(query, [idProyecto]);
        tareas = resultsTareas[0];

        for (const tarea of tareas) {
            if (tarea.idEquipo !== null) {
                //usuarios completo menos password
                //nombre e id de subequipo
                const query2 = `CALL LISTAR_EQUIPO_X_ID_EQUIPO(?);`;
                const [equipo] = await connection.query(query2, [
                    tarea.idEquipo,
                ]);
                tarea.equipo = equipo[0][0]; //solo consideramos que una tarea es asignada a un subequipo
                //listamos los participantes de dicho equipo
                const query4 = `CALL LISTAR_PARTICIPANTES_X_IDEQUIPO(?);`;
                const [participantes] = await connection.query(query4, [
                    tarea.idEquipo,
                ]);
                tarea.equipo.participantes = participantes[0];

                const query5 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                const [usuarios] = await connection.query(query5, [
                    tarea.idTarea,
                ]);
                tarea.usuarios = usuarios[0];
            } else {
                const query3 = `CALL LISTAR_USUARIOS_X_ID_TAREA(?);`;
                const [usuarios] = await connection.query(query3, [
                    tarea.idTarea,
                ]);
                if (usuarios != null) {
                    tarea.usuarios = usuarios[0];
                }
                tarea.equipo = null;
            }
        }

        tareasConPosteriores = repositionPosteriores(tareas);
        tareasOrdenadas = structureData(tareasConPosteriores);
        res.status(200).json({
            tareasOrdenadas,
            message: "Tareas listadas correctamente",
        });
    } catch (error) {
        next(error);
    }
}





async function eliminarTarea(req, res, next) {
    const { tarea } = req.body;
    const query = `CALL ELIMINAR_TAREA(?);`;
    try {
        //await connection.query(query,[idTarea]);
        await eliminarRecursivo(tarea);

        res.status(200).json({
            message: "Tarea eliminada e hijas tambien si tuviera",
        });
        console.log("Se elimino la tarea correctamente");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarRecursivo(tarea) {
    //eliminamos tarea recibida
    console.log(
        "Eliminando tarea '" + tarea.sumillaTarea + "' con ID " + tarea.idTarea
    );
    const query = `CALL ELIMINAR_TAREA(?);`;
    await connection.query(query, [tarea.idTarea]);

    //caso donde no se deba eliminar nada
    if (tarea.tareasHijas.length === 0) {
        return;
    }

    //eliminamos hija
    for (const tareaHija of tarea.tareasHijas) {
        await eliminarRecursivo(tareaHija);
    }
}

// Funcion para agregar las tareas posteriores como atributo a las tareas originales
function repositionPosteriores(tareas){
    const result = {};

    // Organizar las tareas por idPadre
    tareas.forEach((task) => {
        const parentId = task.idTareaAnterior;
        if (!result[parentId]) {
            result[parentId] = [];
        }
        result[parentId].push(task);
    });

    if (!result[null]) {
        return [];
    }

    // Función para agregar hijos a las tareas
    function addChildren(task) {
        task.tareasPosteriores = result[task.idTarea] || [];
        if (task.tareasPosteriores.length === 0) {
            return;
        }
        task.tareasPosteriores.forEach(addChildren);
    }

    // Agregar hijos a las tareas principales (con idPadre null)
    result[null].forEach(addChildren);

    return result[null];
}

// Función para estructurar los datos en un arreglo
function structureData(data) {
    const result = {};

    // Organizar las tareas por idPadre
    data.forEach((task) => {
        const parentId = task.idPadre;
        if (!result[parentId]) {
            result[parentId] = [];
        }
        result[parentId].push(task);
    });

    if (!result[null]) {
        return [];
    }

    // Función para agregar hijos a las tareas
    function addChildren(task) {
        task.tareasHijas = result[task.idTarea] || [];
        if (task.tareasHijas.length === 0) {
            return;
        }
        task.tareasHijas.forEach(addChildren);
    }

    // Agregar hijos a las tareas principales (con idPadre null)
    result[null].forEach(addChildren);

    return result[null];
}

module.exports = {
    crear,
    listarXIdProyecto,
    eliminarTarea
};
