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
        idEntregable,
        idColumnaKanban,
        dependencias
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
            0,
            idEntregable,
            idColumnaKanban
        );
        await usuarioXTareaController.funcCrearUsuariosXTarea(
            usuarios,
            idTarea
        );

        //await insertarTareasPosteriores(tareasPosteriores, idTarea, req.body);

        const query2 = "CALL INSERTAR_TAREA_DEPENDENCIA(?,?);"
        for(const tarea of dependencias){
            const [results] = await connection.query(query2, [idTarea, tarea.idTarea]);
            console.log(`Depdendencia de tarea ${idTarea} en tarea ${tarea.idTarea} creada`);
        }

        console.log(`Tarea ${idTarea} creada`);
        res.status(200).json({ 
            idTarea: idTarea,
            message: `Tarea ${idTarea} creada`
        });
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
        idEntregable, //====================
    } = req.body;
    try {
        await funcModificar(
            idTarea,
            sumillaTarea,
            descripcion,
            idTareaEstado,
            fechaInicio,
            fechaFin,
            idEquipo,
            idEntregable //====================
        );

        await funcEliminarTareasPosteriores(tareasPosterioresEliminadas);
        await funcAgregarTareasPosteriores(
            tareasPosterioresAgregadas,
            usuariosAgregados,
            idTarea,
            idCronograma,
            fechaFin,
            idEntregable
        );

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
    idEquipo,
    idEntregable
) {
    try {
        const query = `CALL MODIFICAR_TAREA(?,?,?,?,?,?,?,?);`;
        await connection.query(query, [
            idTarea,
            sumillaTarea,
            descripcion,
            idTareaEstado,
            fechaInicio,
            fechaFin,
            idEquipo,
            idEntregable,
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
    fechaFinNueva,
    idEntregable
) {
    console.log(
        "================== ID DE TAREA ANTERIOR ES ============",
        idTareaAnterior
    );
    if (tareasPosterioresAgregadas) {
        for (const tarea of tareasPosterioresAgregadas) {
            const idTareaPosterior = await insertarTarea(
                idCronograma,
                tarea.idTareaEstado,
                tarea.idSubGrupo,
                tarea.idPadre,
                idTareaAnterior,
                0, //id sprint
                tarea.sumillaTarea,
                tarea.descripcion,
                fechaFinNueva,
                tarea.fechaFin,
                tarea.cantSubtareas,
                tarea.cantPosteriores,
                tarea.horasPlaneadas,
                1,
                idEntregable,
                null
            );

            await usuarioXTareaController.funcCrearUsuariosXTarea(
                usuariosAgregados,
                idTareaPosterior
            );
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
    esPosterior,
    idEntregable,
    idColumnaKanban
) {
    try {
        const query = `CALL INSERTAR_TAREA(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
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
            idEntregable,
            idColumnaKanban,
        ]);
        let idTarea = results[0][0].idTarea;
        console.log(`Tarea ${idTarea} creada`);
        return idTarea;
    } catch (error) {
        console.log(error);
    }
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
                0, //id sprint en 0
                tarea.sumillaTarea,
                tarea.descripcion,
                originalTareaData.fechaFin,
                tarea.fechaFin,
                0,
                0,
                originalTareaData.horasPlaneadas,
                1,
                originalTareaData.idEntregable,
                null
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
        const tareas = resultsTareas[0];

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
                
                tarea.usuarios = usuarios[0];
                tarea.equipo = null;
            }

            const queryC = "CALL LISTAR_CAMPO_ADICIONAL_X_ID_LINEA_ID_HERRAMIENTA(?,?);"
            const [fields] = await connection.query(queryC, [tarea.idTarea, 4]);

            tarea.camposAdicionales = fields[0];

            const queryD = "CALL LISTAR_DEPENDENCIAS_TAREA_X_ID_TAREA(?);"
            const [dependencias] = await connection.query(queryD, [tarea.idTarea]);
            tarea.dependencias = dependencias[0];

            tarea.tareasPosteriores = [];
        }


        //const tareasConPosteriores = await repositionPosteriores(tareas);
        const tareasOrdenadas = await structureData(tareas);
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

        //FALTA QUE AQUI SE ELIMINEN TODAS LAS POSTERIORES

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

async function funcDeletearTarea(idTarea) {
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
            //si no tiene arreglo, crealo
            result[parentId] = [];
        }


        if(task.esPosterior === 0){
            result[null].push(task);
        }
        else{
            result[parentId].push(task);
        }
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
    //
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_SPRINT(?);`;
        const [results] = await connection.query(query, [idSprint]);
        const tareas = results[0];

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

        return tareas;
    } catch (error) {
        console.log(error);
    }
}

async function modificarIdSprintDeTareas(req, res, next) {
    const { tareasModificadas } = req.body;
    try {
        for (const tarea of tareasModificadas) {
            await funcModificarTareaIdSprint(tarea.idTarea, tarea.idSprint);
        }
        res.status(200).json({ message: "Tareas modificadas" });
    } catch (error) {
        next(error);
    }
}

async function funcModificarTareaIdSprint(idTarea, idSprint) {
    try {
        const query = `CALL MODIFICAR_TAREA_ID_SPRINT(?,?);`;
        const [results] = await connection.query(query, [idTarea, idSprint]);
        console.log(`Tarea ${idTarea} modificada, nuevo sprint: ${idSprint}`);
        return 1;
    } catch (error) {
        console.log(error);
    }
}

async function funcListarTareasSinSprint(idCronograma) {
    //
    try {
        const query = `CALL LISTAR_TAREAS_SIN_SPRINT_X_ID_CRONOGRAMA(?);`;
        const [results] = await connection.query(query, [idCronograma]);
        const tareas = results[0];

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

        return tareas;
    } catch (error) {
        console.log(error);
    }
}

async function registrarProgreso(req, res, next) {
    const {
        idTarea,
        idUsuario,
        descripcion,
        porcentajeRegistrado,
        porcentajeDeTarea,
    } = req.body;
    try {
        const query = `CALL INSERTAR_REGISTRO_PROGRESO_TAREA(?,?,?,?,?);`;
        const [results] = await connection.query(query, [
            idTarea,
            idUsuario,
            descripcion,
            porcentajeRegistrado,
            porcentajeDeTarea,
        ]);
        const idRegistroProgreso = results[0][0].idRegistroProgreso;
        res.status(200).json({
            idRegistroProgreso,
            message: "Registro exitoso de el progreso en la tarea",
        });
    } catch (error) {
        next(error);
    }
}

async function listarXIdProyectoConProgresos(req, res, next) {
    const { idProyecto } = req.params;
    try {
        const query = `CALL LISTAR_TAREAS_X_ID_PROYECTO(?);`;
        const [resultsTareas] = await connection.query(query, [idProyecto]);
        const tareas = resultsTareas[0];

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
                
                tarea.usuarios = usuarios[0];
                tarea.equipo = null;
            }

            const query4 = "CALL GetChildTasksProgresses(?);";
            const [progresos] = await connection.query(query4, [tarea.idTarea]);
            tarea.progresos = progresos[0];
        }

        const tareasConPosteriores = await repositionPosteriores(tareas);
        const tareasOrdenadas = await structureData(tareasConPosteriores);
        res.status(200).json({
            tareasOrdenadas,
            message: "Tareas listadas correctamente",
        });
    } catch (error) {
        next(error);
    }
}


async function verificarAccesoEdicion(req, res, next){
    const {idTarea, idUsuario} = req.body;
    try{
        const query = "CALL INSERTAR_EDICION_TAREA(?,?);"
        const [resultado] = await connection.query(query,[idTarea,idUsuario]);
        let usuarioEditando = resultado[0][0];

        console.log("DATA DE BD ========================");
        console.log(JSON.stringify(usuarioEditando));

        let resultadoAcceso = 0;
        if(usuarioEditando.resultadoAcceso === 0){
            //esta ocupado, te devuelvo data de usuario que lo esta ocupando
            resultadoAcceso = 0;
        }
        else{
            //no esta ocupado, puedes editar
            resultadoAcceso = 1;
            usuarioEditando = null;
        }

        console.log("Resultado de acceso: ======================");
        console.log(resultadoAcceso);
        console.log("Usuario editando: ======================");
        console.log(usuarioEditando);

        res.status(200).json({
            resultadoAcceso: resultadoAcceso,
            usuarioEditando: usuarioEditando,
            message: "Puedes editar"
        })
    }catch(e){
        next(e);
    }
}

async function salirEdicionTarea(req, res, next){
    const {idTarea} = req.body;
    try{
        const query = "CALL SALIR_EDICION_TAREA(?);"
        const [resultado] = await connection.query(query,[idTarea]);

        res.status(200).json({
            message: "Se limpio el slot de edicion en la tarea"
        })
    }catch(e){
        next(e);
    }
}



module.exports = {
    crear,
    listarXIdProyecto,
    eliminarTarea,
    funcEliminarTarea,
    modificar,
    funcListarTareasXIdSprint,
    funcListarTareasSinSprint,
    modificarIdSprintDeTareas,
    eliminarRecursivo,
    funcModificarTareaIdSprint,
    registrarProgreso,
    listarXIdProyectoConProgresos,
    verificarAccesoEdicion,
    salirEdicionTarea
};
