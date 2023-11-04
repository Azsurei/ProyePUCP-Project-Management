const connection = require("../../config/db");
const usuarioXTareaController = require("./usuarioXTareaController");

async function crear(req, res, next) {
    const {
        idCronograma,
        idTareaEstado,
        idSubGrupo,
        idPadre,
        idTareaAnterior,
        idSprint,
        sumillaTarea,
        descripcion,
        fechaInicio,
        fechaFin,
        cantSubtareas,
        cantPosteriores,
        horasPlaneadas,
        usuarios,
        tareasPosteriores,
    } = req.body;

    try {
        const idTarea = await insertarTarea(
            idCronograma,
            idTareaEstado,
            idSubGrupo,
            idPadre,
            idTareaAnterior,
            idSprint,
            sumillaTarea,
            descripcion,
            fechaInicio,
            fechaFin,
            cantSubtareas,
            cantPosteriores,
            horasPlaneadas,
            0
        );
        await usuarioXTareaController.funcCrearUsuariosXTarea(
            usuarios,
            idTarea
        );
        //await insertarTareas(subTareas);  --Ya no insertamos subTareas en esta seccion, se insertan como normales
        await insertarTareasPosteriores(tareasPosteriores, idTarea, req.body);
        console.log(`Tarea ${idTarea} creada`);
        res.status(200).json({ message: `Tarea ${idTarea} creada` });
    } catch (error) {
        next(error);
        console.log(error);
    }
}

async function modificar(req, res, next) {
    const {
        idCronograma,
        idTarea,
        sumillaTarea,
        descripcion,
        idTareaEstado,
        fechaInicio,
        fechaFin,
        idEquipo,
        tareasPosterioresAgregadas,
        tareasPosterioresEliminadas,
        usuariosAgregados,
        usuariosEliminados,
    } = req.body;
    try {
        await funcModificar(
            idTarea,
            sumillaTarea,
            descripcion,
            idTareaEstado,
            fechaInicio,
            fechaFin,
            idEquipo
        );

        await funcEliminarTareasPosteriores(tareasPosterioresEliminadas);
        await funcAgregarTareasPosteriores(tareasPosterioresAgregadas, usuariosAgregados, idTarea, idCronograma, fechaFin);
        

        await usuarioXTareaController.funcEliminarUsuariosXTarea(
            //barre todos los usuarios de la tarea
            usuariosEliminados,
            idTarea
        );
        await usuarioXTareaController.funcCrearUsuariosXTarea(
            usuariosAgregados,
            idTarea
        );

        res.status(200).json({ message: `Tarea ${idTarea} modificada` });
    } catch (error) {
        next(error);
    }
}

async function funcModificar(
    idTarea,
    sumillaTarea,
    descripcion,
    idTareaEstado,
    fechaInicio,
    fechaFin,
    idEquipo
) {
    try {
        const query = `CALL MODIFICAR_TAREA(?,?,?,?,?,?,?);`;
        await connection.query(query, [
            idTarea,
            sumillaTarea,
            descripcion,
            idTareaEstado,
            fechaInicio,
            fechaFin,
            idEquipo,
        ]);
    } catch (error) {
        console.log(error);
        return -1;
    }
    return idTarea;
}

async function funcAgregarTareasPosteriores(
    tareasPosterioresAgregadas,
    usuariosAgregados,
    idTareaAnterior,
    idCronograma,
    fechaFinNueva
) {
    console.log("================== ID DE TAREA ANTERIOR ES ============", idTareaAnterior);
    if (tareasPosterioresAgregadas) {
        for (const tarea of tareasPosterioresAgregadas) {
            const idTareaPosterior = await insertarTarea(
                idCronograma,
                tarea.idTareaEstado,
                tarea.idSubGrupo,
                null,
                idTareaAnterior,
                tarea.sumillaTarea,
                tarea.descripcion,
                fechaFinNueva,
                tarea.fechaFin,
                tarea.cantSubtareas,
                tarea.cantPosteriores,
                tarea.horasPlaneadas,
                1
            );

            await usuarioXTareaController.funcCrearUsuariosXTarea(usuariosAgregados,idTareaPosterior);
        }
    }
}

async function funcEliminarTareasPosteriores(tareasPosterioresEliminadas) {
    if (tareasPosterioresEliminadas) {
        for (const tarea of tareasPosterioresEliminadas) {
            //usamos un delete solo en este caso ya que las tareas posteriores son prescindibles, 
            //no contienen data importante mas que una fecha
            await funcDeletearTarea(tarea.idTarea);
        }
    }
}

async function funcModificarTareasPosteriores(tareasPosteriores) {
    if (tareasPosteriores) {
        for (const tarea of tareasPosteriores) {
            await funcModificar(
                tarea.idTarea,
                tarea.sumillaTarea,
                tarea.descripcion,
                tarea.idTareaEstado,
                tarea.fechaInicio,
                tarea.fechaFin,
                tarea.idEquipo
            );
        }
    }
}

async function insertarTarea(
    idCronograma,
    idTareaEstado,
    idSubGrupo,
    idPadre,
    idTareaAnterior,
    idSprint,
    sumillaTarea,
    descripcion,
    fechaInicio,
    fechaFin,
    cantSubtareas,
    cantPosteriores,
    horasPlaneadas,
    esPosterior
) {
    const query = `CALL INSERTAR_TAREA(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [results] = await connection.query(query, [
        idCronograma,
        idTareaEstado,
        idSubGrupo,
        idPadre,
        idTareaAnterior,
        idSprint,
        sumillaTarea,
        descripcion,
        fechaInicio,
        fechaFin,
        cantSubtareas,
        cantPosteriores,
        horasPlaneadas,
        esPosterior,
    ]);
    return results[0][0].idTarea;
}

async function insertarTareasPosteriores(
    tareas,
    idTareaPrevia,
    originalTareaData
) {
    if (tareas) {
        for (const tarea of tareas) {
            const idTarea = await insertarTarea(
                originalTareaData.idCronograma,
                1,
                originalTareaData.idSubGrupo,
                originalTareaData.idPadre, // (?)
                idTareaPrevia,
                tarea.idSprint,
                tarea.sumillaTarea,
                tarea.descripcion,
                originalTareaData.fechaFin,
                tarea.fechaFin,
                0,
                0,
                null,
                1
            );
            await usuarioXTareaController.funcCrearUsuariosXTarea(
                originalTareaData.usuarios,
                idTarea
            );
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
                tarea.usuarios = [];
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

    await funcEliminarTarea(tarea.idTarea);

    //caso donde no se deba eliminar nada
    if (tarea.tareasHijas.length === 0) {
        return;
    }

    //eliminamos hija
    for (const tareaHija of tarea.tareasHijas) {
        await eliminarRecursivo(tareaHija);
    }
}

async function funcEliminarTarea(idTarea) {
    try {
        const query = `CALL ELIMINAR_TAREA(?);`;
        await connection.query(query, [idTarea]);
    } catch (error) {
        console.log(error);
    }
}

async function funcDeletearTarea(idTarea){
    try {
        const query = `CALL DELETEAR_TAREA(?);`;
        await connection.query(query, [idTarea]);
    } catch (error) {
        console.log(error);
    }
}

// Funcion para agregar las tareas posteriores como atributo a las tareas originales
function repositionPosteriores(tareas) {
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

async function funcListarTareasXIdSprint(idSprint) {
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_SPRINT(?);`;
        const [results] = await connection.query(query, [idSprint]);
        const tareas = results[0];
        return tareas;
    } catch (error) {
        console.log(error);
    }

}

async function modificarIdSprintDeTareas(req, res, next) {
    const {tareasModificadas} = req.body;
    try {
        for(const tarea of tareasModificadas){
            await funcModificarTareaIdSprint(tarea.idTarea,tarea.idSprint);
        }
        res.status(200).json({message: "Tareas modificadas"});
    } catch (error) {
        next(error);
    }
}

async function funcModificarTareaIdSprint(idTarea,idSprint){
    try {
        const query = `CALL MODIFICAR_TAREA_ID_SPRINT(?,?);`;
        const [results]=await connection.query(query, [idTarea,idSprint]);
        console.log(`Tarea ${idTarea} modificada, nuevo sprint: ${idSprint}`);
        return 1.
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    crear,
    listarXIdProyecto,
    eliminarTarea,
    funcEliminarTarea,
    modificar,
    funcListarTareasXIdSprint,
    modificarIdSprintDeTareas,
    eliminarRecursivo
};
