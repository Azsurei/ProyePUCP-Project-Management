const connection = require("../../config/db");

async function insertarGrupoProyectos(req, res, next) {
    const { nombreGrupo, idUsuario, proyectos } = req.body;

    const listProyectos = proyectos.map((proyect) => {
        return parseInt(proyect);
    });

    const query = `CALL INSERTAR_GRUPO_PROYECTO(?,?);`;
    const query1 = `CALL INSERTAR_PROYECTO_EN_GRUPO(?,?);`;
    try {
        const [results] = await connection.query(query, [
            nombreGrupo,
            idUsuario,
        ]);
        const idGrupoDeProyecto = results[0][0].idGrupoDeProyecto;

        for (let proyecto of listProyectos) {
            await connection.query(query1, [proyecto, idGrupoDeProyecto]);
        }
        res.status(200).json({
            message: "Se insertó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}
async function listarGruposProyecto(req, res, next) {
    const { idUsuario } = req.params;
    try {
        const query = `CALL LISTAR_GRUPO_PROYECTOS_X_ID_USUARIO(?);`;
        const [results] = await connection.query(query, [idUsuario]);
        const grupos = results[0];
        res.status(200).json({ grupos, message: "Grupos listados" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarProyectosXGrupo(req, res, next) {
    const { idGrupoProyecto } = req.params;

    //de presupuesto
    const query = `CALL LISTAR_PROYECTOS_PRESUPUESTO_X_GRUPO_PROYECTOS(?);`;
    const query1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
    const query2 = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`; //trae tareas padres absolutas (o sin hijos)

    try {
        const [results] = await connection.query(query, [idGrupoProyecto]);
        const proyectos = results[0];
        for (let proyecto of proyectos) {
            const [results1] = await connection.query(query1, [
                proyecto.idPresupuesto,
            ]);
            let ingresos = results1[0];
            proyecto.ingresos = ingresos;
            const [results2] = await connection.query(query2, [
                proyecto.idPresupuesto,
            ]);
            let egresos = results2[0];
            proyecto.egresos = egresos;
        }
        res.status(200).json({
            proyectos,
            message: "Se listó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

//un arreglo de proyectos
//cada proyecto debe tener data de presupuesto
//cada proyecto debe tener data de entregables
//cada proyecto debe tener data de tareas

async function listarDatosProyectosXGrupo(req, res, next) {
    const { idGrupoProyecto } = req.params;

    //de proyecto
    const query = `CALL LISTAR_PROYECTOS_X_GRUPO_PROYECTOS(?);`;

    //de herramientas
    const queryA1 = `CALL LISTAR_EDT_CRONOGRAMA_PRESUPUESTO_X_ID_PROYECTO(?);`;

    //de presupuesto
    const queryP1 = `CALL LISTAR_LINEA_INGRESO_X_ID_PRESUPUESTO(?);`;
    const queryP2 = `CALL LISTAR_LINEA_EGRESO_X_ID_PRESUPUESTO(?);`;

    //de tareas
    const queryT1 = "CALL LISTAR_TAREAS_GENERALES_X_ID_CRONOGRAMA(?);";

    //de entregables
    const queryE1 = `CALL LISTAR_ENTREGABLES_X_ID_EDT(?);`;
    const queryE2 = `CALL LISTAR_TAREAS_ULTIMO_NIVEL_X_ID_CRONOGRAMA(?);`;

    try {
        const [results] = await connection.query(query, [idGrupoProyecto]);
        const proyectos = results[0];

        for (const proyecto of proyectos) {
            const [resultsB] = await connection.query(queryA1, [
                proyecto.idProyecto,
            ]);
            const idHerramientas = resultsB[0][0];

            proyecto.EDT = {};
            proyecto.cronograma = {};
            proyecto.presupuesto = {};

            const EDT = {
                idEDT:
                    idHerramientas.idEDT === undefined ||
                    idHerramientas.idEDT === null
                        ? 0
                        : idHerramientas.idEDT,
                entregables: [],
            };
            const cronograma = {
                idCronograma:
                    idHerramientas.idCronograma === undefined ||
                    idHerramientas.idCronograma === null
                        ? 0
                        : idHerramientas.idCronograma,
                tareas: [],
            };
            const presupuesto = {
                idPresupuesto:
                    idHerramientas.idPresupuesto === undefined ||
                    idHerramientas.idPresupuesto === null
                        ? 0
                        : idHerramientas.idPresupuesto,
                ingresos: [],
                egresos: [],
            };

            proyecto.EDT = EDT;
            proyecto.cronograma = cronograma;
            proyecto.presupuesto = presupuesto;

            //para presupuesto
            const [resultsP1] = await connection.query(queryP1, [
                proyecto.presupuesto.idPresupuesto,
            ]);
            const ingresos = resultsP1[0];
            proyecto.presupuesto.ingresos = ingresos;

            const [resultsP2] = await connection.query(queryP2, [
                proyecto.presupuesto.idPresupuesto,
            ]);
            const egresos = resultsP2[0];
            proyecto.presupuesto.egresos = egresos;

            //para tareas
            const [resultsT1] = await connection.query(queryT1, [
                proyecto.cronograma.idCronograma,
            ]);
            const tareas = resultsT1[0];
            proyecto.cronograma.tareas = tareas;

            //para entregables
            const [resultsE1] = await connection.query(queryE1, [
                proyecto.EDT.idEDT,
            ]);
            const [resultsE2] = await connection.query(queryE2, [
                proyecto.cronograma.idCronograma,
            ]);
            const entregables = resultsE1[0];
            const tareasUltimoNivel = resultsE2[0];
            proyecto.EDT.entregables = entregables;

            for (const entregable of proyecto.EDT.entregables) {
                const filteredTareas = tareasUltimoNivel.filter(
                    (tarea) => (tarea.idEntregable = entregable.idEntregable)
                );
                const cantidadTareas = filteredTareas.length;

                let porcentajeSumarizado = 0;
                if (cantidadTareas === 0) {
                    entregable.porcentajeProgreso = 0;
                } else {
                    for (const tareas of filteredTareas) {
                        porcentajeSumarizado +=
                            tareas.porcentajeProgreso / cantidadTareas;
                    }

                    const formattedProgress =
                        typeof porcentajeSumarizado === "number"
                            ? porcentajeSumarizado.toFixed(2)
                            : porcentajeSumarizado;
                    entregable.porcentajeProgreso = formattedProgress;
                }
            }
        }

        res.status(200).json({
            proyectos,
            message: "Se listó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function modificar(req,res,next){
    const {idGrupoDeProyecto, nombre, proyectosAgregados, proyectosEliminados} = req.body;

    const listProyectosAgregados = proyectosAgregados.map((proyect) => {
        return parseInt(proyect);
    });
    const listProyectosEliminados = proyectosEliminados.map((proyect) => {
        return parseInt(proyect);
    });

    try {
        const query = `CALL MODIFICAR_GRUPO_DE_PROYECTO(?,?);`;
        const query1 = `CALL INSERTAR_PROYECTO_EN_GRUPO(?,?);`;
        const query2 = `CALL ELIMINAR_PROYECTO_DE_GRUPO_PROYECTO(?);`;
        await connection.query(query,[idGrupoDeProyecto, nombre]);
        // Para agregar nuevos Proyectos al grupo
        for (let proyecto of listProyectosAgregados) {
            await connection.query(query1, [proyecto, idGrupoDeProyecto]);
        }
        // Para eliminar Proyectos del grupo
        for (let proyecto of listProyectosEliminados) {
            await connection.query(query2, [proyecto]);
        }

        console.log(`Grupo De Proyectos ${idGrupoDeProyecto} modificado`);
        res.status(200).json({message: "Grupo De Proyectos modificado"});
    } catch (error) {
        console.log("Error al Modificar Grupo De Proyectos",error);
        next(error);
    }
}

async function eliminar(req, res, next) {
    const { idGrupoDeProyecto } = req.body;
    try {
        const query = `CALL ELIMINAR_GRUPO_PROYECTOS_X_ID_GRUPO_PROYECTOS(?);`;
        await connection.query(query, [idGrupoDeProyecto]);
        console.log(`Grupo de Proyectos ${idGrupoDeProyecto} eliminado`);    
        res.status(200).json({
            message: "Grupo de Proyectos eliminado exitosamente"
        });
    } catch (error) {
        console.log("Error en la eliminacion ",error);
        res.status(500).send("Error en la eliminacion: " + error.message);
        next(error);
    }
}

module.exports = {
    insertarGrupoProyectos,
    listarGruposProyecto,
    listarProyectosXGrupo,
    listarDatosProyectosXGrupo,
    modificar,
    eliminar
};
