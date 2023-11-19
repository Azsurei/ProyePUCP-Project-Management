const connection = require("../config/db");
const { verifyToken } = require("../middleware/middlewares");
const backlogController = require("../controllers/backlog/backlogController");
const EDTController = require("../controllers/EDT/EDTController");
const actaConstitucionController = require("../controllers/actaConstitucion/actaConstitucionController");
const cronogramaController = require("../controllers/cronograma/cronogramaController");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");
const catalogoInteresadosController = require("../controllers/catalogoInteresados/catalogoInteresadosController");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");
const retrospectivaController = require("../controllers/retrospectiva/retrospectivaController");
const actaReunionController = require("../controllers/actaReunion/actaReunionController");
const equipoController = require("../controllers/equipo/equipoController");
const presupuestoController = require("../controllers/presupuesto/presupuestoController");
const planCalidadController = require("../controllers/planCalidad/planCalidadController");

async function crear(req, res, next) {
    const idUsuario = req.user.id; //del token
    const {
        proyecto,
        herramientas,
        participantesSupervisores,
        participantesMiembros,
    } = req.body;

    console.log("Llegue a recibir solicitud creacion proyecto");
    console.log(
        "imprimiendo participantesSupervisores: " + participantesSupervisores
    );
    console.log("imprimiendo participantesMiembros: " + participantesMiembros);
    let idProyecto;

    try {
        const query = `CALL INSERTAR_PROYECTO(?,?,?,?,?);`;
        const { nombre, fechaInicio, fechaFin } = proyecto;
        console.log(
            `Nombre de proyecto es  ${nombre}, fecha inicio es ${fechaInicio} y fecha fin es ${fechaInicio}`
        );
        const [results] = await connection.query(query, [
            idUsuario,
            nombre,
            99,
            fechaInicio,
            fechaFin,
        ]);
        //cambie a 99 porque en front no contemplamos esto, conversar si maxCantParticipantes es un requisito con cliente

        idProyecto = results[0][0].idProyecto;
        console.log(`Se creo el proyecto ${idProyecto} con exito!`);
        //Recordar, este query crea el proyecto y asigna al usuario de creacion como el Jefe de proyecto en tabla UsuarioXRolXProyecto
        console.log("==========================test=================");

        try {
            //sirve para registrar en la tabla HerramientaXProyecto, de esta reconoceremos facilmente que herramientas se deben mostrar listas a uso en el proyecto
            /*for (const herramienta of herramientas) {
                const query = `
                            CALL INSERTAR_HERRAMIENTA_X_PROYECTO(?,?);
                        `;
                //const { idHerramienta, nombre, descripcion } = herramienta;

                const [results] = await connection.query(query, [
                    idProyecto,
                    herramienta.idHerramienta,
                ]);

                const idHerramientaXProyecto =
                    results[0][0].idHerramientaXProyecto;

                console.log(
                    `Se creo el idHerramientaXProyecto ${idHerramientaXProyecto}!`
                );
            }*/

            try {
                ///ahora, por cada herramienta, se creara en la DB y se asignara a proyecto
                let query;

                query = `CALL INSERTAR_PRODUCT_BACKLOG(?);`;
                const [results1] = await connection.query(query, [idProyecto]);
                const idProductBacklog = results1[0][0].idProductBacklog;

                query = `CALL INSERTAR_EDT(?,?,?,?,?);`;
                const [results2] = await connection.query(query, [
                    idProyecto,
                    "",
                    "",
                    "",
                    "",
                ]);
                const idEDT = results2[0][0].idEDT;

                query = `CALL INSERTAR_CRONOGRAMA(?);`;
                const [results3] = await connection.query(query, [idProyecto]);
                const idCronograma = results3[0][0].idCronograma;

                query = "CALL INSERTAR_PRESUPUESTO(?,?,?,?)";
                const [results4] = await connection.query(query, [
                    idProyecto,
                    2,
                    0,
                    0,
                ]);
                const idPresupuesto = results4[0][0].idPresupuesto;

                for (const herramienta of herramientas) {
                    // if (herramienta.idHerramienta === 1) {
                    //     //Product Backlog
                    //     query = `CALL INSERTAR_PRODUCT_BACKLOG(?);`;
                    //     const [results] = await connection.query(query, [
                    //         idProyecto,
                    //     ]);
                    //     const idProductBacklog = results[0][0].idProductBacklog;
                    // }

                    // if (herramienta.idHerramienta === 2) {
                    //     //EDT
                    //     query = `CALL INSERTAR_EDT(?,?,?,?,?);`;
                    //     const [results] = await connection.query(query, [
                    //         idProyecto,
                    //         "",
                    //         "",
                    //         "",
                    //         "",
                    //     ]);
                    //     const idEDT = results[0][0].idEDT;
                    // }

                    if (herramienta.idHerramienta === 3) {
                        //Acta de Constitucion
                        query = `CALL INSERTAR_ACTA_CONSTITUCION(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idActaConstitucion =
                            results[0][0].idActaConstitucion;
                        const [detalleAC] = await connection.query(`
                            CALL INSERTAR_DETALLEAC_CREADO(${idActaConstitucion});
                            `);
                    }

                    if (herramienta.idHerramienta === 5) {
                        //Catalogo de riesgo
                        query = `CALL INSERTAR_CATALOGO_RIESGO(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idCatalogo = results[0][0].idCatalogo;
                    }

                    if (herramienta.idHerramienta === 6) {
                        //Catalogo de interesados
                        query = `CALL INSERTAR_CATALOGO_INTERESADO(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idCatalogoInteresado =
                            results[0][0].idCatalogoInteresado;
                    }

                    if (herramienta.idHerramienta === 7) {
                        //Matriz de responsabilidad
                        query = `CALL INSERTAR_MATRIZ_RESPONSABILIDAD(?);`;
                        query1 = `CALL INSERTAR_RESPONSABILIDADROL_X_IDMATRIZ(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idMatrizResponsabilidad =
                            results[0][0].idMatrizResponsabilidad;
                        const [results1] = await connection.query(query1, [
                            idMatrizResponsabilidad,
                        ]);
                    }

                    if (herramienta.idHerramienta === 8) {
                        //Matriz de comunicacion
                        query = `CALL INSERTAR_MATRIZ_COMUNICACION(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idMatrizComunicacion =
                            results[0][0].idMatrizComunicacion;
                    }

                    if (herramienta.idHerramienta === 9) {
                        //Autoevaluacion
                        query = `CALL INSERTAR_AUTOEVALUACION(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idAutoevaluacion = results[0][0].idAutoevaluacion;
                    }

                    if (herramienta.idHerramienta === 10) {
                        //Retrospectiva
                        query = `CALL INSERTAR_RETROSPECTIVA(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idRetrospectiva = results[0][0].idRetrospectiva;
                    }

                    if (herramienta.idHerramienta === 11) {
                        //Acta de reunion
                        query = `CALL INSERTAR_ACTA_REUNION(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idActaReunion = results[0][0].idActaReunion;
                    }

                    if (herramienta.idHerramienta === 12) {
                        //Equipo
                        console.log(
                            "Llegue a recibir solicitud insertar equipo"
                        );
                        const query = `CALL INSERTAR_HERRAMIENTA_X_PROYECTO(?,?,?);`;
                        const query1 = `CALL INSERTAR_ROL_MIEMBRO_LIDER(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                            12,
                            null,
                        ]);
                        const idEquipo = results[0][0].idEquipo;
                        console.log(`Se creo el equipo${idEquipo}!`);
                        const [results1] = await connection.query(query1, [
                            idProyecto,
                        ]);
                    }

                    // if (herramienta.idHerramienta === 13) {
                    //     //Presupeusto
                    //     query = "CALL INSERTAR_PRESUPUESTO(?,?,?,?)";
                    //     const [results] = await connection.query(query, [
                    //         idProyecto,
                    //         2,
                    //         0,
                    //         0,
                    //     ]);
                    //     //Esos dos 0s están por justo xdxd
                    //     const idPresupuesto = results[0][0].idPresupuesto;
                    // }
                    //13 (Presupuesto) si necesitaria su CALL INSERTAR_PRESUPUESTO, pero la tabla de presupuesto
                    //esta mal porque no tiene de columna idProyecto, no se le puede asociar a un proyecto aun

                    if (herramienta.idHerramienta === 14) {
                        // Repositorio de documentos
                        query = `CALL INSERTAR_REPOSTORIO_DOCUMENTOS(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idRepositorioDocumentos = results[0][0].idRepositorioDocumentos;
                    }

                    if (herramienta.idHerramienta === 15) {
                        // Repositorio de documentos
                        query = `CALL INSERTAR_PLAN_CALIDAD(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);
                        const idPlanCalidad = results[0][0].idPlanCalidad;
                    }
                }
                // Insertamos los supervisores
                try {
                    const query = `CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);`;
                    for (const participante of participantesSupervisores) {
                        const [results] = await connection.query(query, [
                            participante.idUsuario,
                            2,
                            idProyecto,
                        ]);
                        const idUsuarioXRolProyecto =
                            results[0][0].idUsuarioXRolProyecto;
                        console.log(`Se agrego el usuario ${
                            participante.idUsuario
                        } 
                            al proyecto ${idProyecto} con el rol ${2}`);
                    }

                    //Insertamos los miembros
                    try {
                        const query = `CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);`;
                        for (const participante of participantesMiembros) {
                            const [results] = await connection.query(query, [
                                participante.idUsuario,
                                3,
                                idProyecto,
                            ]);
                            const idUsuarioXRolProyecto =
                                results[0][0].idUsuarioXRolProyecto;
                            console.log(`Se agrego el usuario ${
                                participante.idUsuario
                            }
                                 al proyecto ${idProyecto} con el rol ${3}`);
                        }
                        res.status(200).json({
                            message:
                                "Registro COMPLETO de datos, herramientas y participantes de proyecto terminado con exito",
                        });
                    } catch (error) {
                        console.error(
                            `Error en el registro del usuario ${
                                participante.idUsuario
                            } al proyecto ${idProyecto} con el rol ${2}`,
                            error
                        );
                        res.status(500).send(
                            `Error en el registro del usuario ${
                                participante.idUsuario
                            } al proyecto ${idProyecto} con el rol ${2}` +
                                error.message
                        );
                    }
                } catch (error) {
                    console.error(
                        `Error en el registro del usuario ${
                            participante.idUsuario
                        } al proyecto ${idProyecto} con el rol ${2}`,
                        error
                    );
                    res.status(500).send(
                        `Error en el registro del usuario ${
                            participante.idUsuario
                        } al proyecto ${idProyecto} con el rol ${2}` +
                            error.message
                    );
                }
            } catch (error) {
                console.error(
                    `Error de creacion de una herramienta para proyecto ${idProyecto}`,
                    error
                );
                res.status(500).send(
                    `Error de creacion de una herramienta para proyecto ${idProyecto}` +
                        error.message
                );
            }
        } catch (error) {
            console.error(
                "Error en el registro de herramientas X Proyecto:",
                error
            );
            res.status(500).send(
                "Error en el registro de herramientas X proyecto: " +
                    error.message
            );
        }
    } catch (error) {
        console.error("Error en el registro del proyecto :", error);
        res.status(500).send(
            "Error en el registro del proyecto: " + error.message
        );
    }
}

async function insertarUsuarioXRolXProyecto(req, res, next) {
    const idUsuario = req.user.id;
    //Insertar query aca
    const { idRol, idProyecto } = req.body;
    console.log("Llegue a recibir insertar usuario por rol en proyecto ");
    const query = `CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);`;
    try {
        const [results] = await connection.query(query, [
            idUsuario,
            idRol,
            idProyecto,
        ]);
        const idUsuarioXRolProyecto = results[0][0].idUsuarioXRolProyecto;
        res.status(200).json({
            idUsuarioXRolProyecto,
            message: "Usuario registrado en proyecto por rol",
        });
        console.log(`Se creo el proyecto ${idProyecto}!`);
    } catch (error) {
        console.error(
            "Error en el registro de usuario por rol en proyecto:",
            error
        );
        res.status(500).send(
            "Error en el registro de usuario por rol en proyecto:" +
                error.message
        );
    }
}

async function listarProyectosUsuario(req, res, next) {
    console.log("Llegue a recibir solicitud listar proyecto");
    const idUsuario = req.user.id;
    let query = `CALL LISTAR_PROYECTOS_X_ID_USUARIO(?);`;
    try {
        const [results] = await connection.query(query, [idUsuario]);
        const proyectos = results[0];
        try {
            query = "CALL LISTAR_USUARIOS_X_ROL_X_PROYECTO(?,?)";

            // Colocamos 3 para listar solo los miembros del equipo
            for (const proyecto of proyectos) {
                const [results_users] = await connection.query(query, [
                    3,
                    proyecto.idProyecto,
                ]);
                proyecto.miembros = results_users[0];
            }
            //console.log(JSON.stringify(proyectos, null, 2));
            res.status(200).json({
                proyectos,
                message: "Listado de proyectos con sus miembros exitoso",
            });
            console.log(`Se listaron los proyectos con sus usuarios!`);
        } catch (error) {
            console.error(
                "Error en el listado de los usuarios del proyecto:",
                error
            );
            res.status(500).send(
                "Error en el listado de los usuarios del proyecto:" +
                    error.message
            );
        }
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send(
            "Error al obtener los proyectos: " + error.message
        );
    }
}

async function listarProyectosXNombre(req, res, next) {
    console.log("Llegue a recibir solicitud Listar Proyecto por Nombre");
    const { idUsuario, nombre } = req.body;
    const query = `CALL LISTAR_PROYECTOS_X_NOMBRE(?,?);`;
    try {
        const [results] = await connection.query(query, [idUsuario, nombre]);
        res.status(200).json({
            proyectos: results[0],
            message: "Proyectos obtenidos exitosamente",
        });
        //console.log(results[0]);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send(
            "Error al obtener los proyectos: " + error.message
        );
    }
}

async function listarProyectoYGrupoProyecto(req, res) {
    //Insertar query aca
    const { idProyecto } = req.params;
    console.log("Llegue a recibir solicitud listar Historias Prioridad");
    const query = `CALL LISTAR_PROYECTO_Y_GRUPO_DE_PROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        res.status(200).json({
            historiasPrioridad: results[0],
            message: "Historias prioridad obtenidos exitosamente",
        });
        console.log("Si se listarion las prioridades de las historias");
    } catch (error) {
        console.error("Error al obtener las historias prioridad:", error);
        res.status(500).send(
            "Error al obtener las historias prioridad: " + error.message
        );
    }
}

async function listarUsuariosXRolXProyecto(req, res) {
    //Insertar query aca
    const { idRol, idProyecto } = req.body;
    const query = `CALL LISTAR_USUARIOS_X_ROL_X_PROYECTO(?,?);`;
    try {
        const [results] = await connection.query(query, [idRol, idProyecto]);
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios por rol en proyecto obtenidos exitosamente",
        });
        //console.log(results[0]);
        console.log("Si se listaron los usuarios por rol en proyecto");
    } catch (error) {
        console.error(
            "Error al obtener los usuarios por rol en proyecto",
            error
        );
        res.status(500).send(
            "Error al obtener los usuarios por rol en proyecto: " +
                error.message
        );
    }
}

async function listarUsuariosXProyecto(req, res) {
    //Insertar query aca
    const { idProyecto } = req.params;
    console.log(idProyecto);
    const query = `CALL LISTAR_USUARIOS_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        res.status(200).json({
            usuarios: results[0],
            message: "Usuarios por rol en proyecto obtenidos exitosamente",
        });
        //console.log(results[0]);
        console.log("Si se listaron los usuarios por rol en proyecto");
    } catch (error) {
        console.error(
            "Error al obtener los usuarios por rol en proyecto",
            error
        );
        res.status(500).send(
            "Error al obtener los usuarios por rol en proyecto: " +
                error.message
        );
    }
}

async function eliminar(req, res, next) {
    console.log(req.params);
    console.log(req.body);
    const { idProyecto, herramientas } = req.body;
    console.log("Recibiendo para Eliminacion al Proyecto ", idProyecto);
    try {
        await funcEliminar(idProyecto, herramientas);
        console.log(`Proyecto ${idProyecto} eliminado`);
        res.status(200).json({
            message: "Proyecto eliminado correctamente",
        });
    } catch (error) {
        next(error);
    }
}

async function funcEliminar(idProyecto, herramientas) {
    try {
        console.log("Iniciando Eliminacion del Proyecto ", idProyecto);
        const query = `CALL ELIMINAR_PROYECTO(?);`;
        await connection.query(query, [idProyecto]);

        // idHerramientaCreada es la herramienta relacionada al proyecto.
        // idHerramienta es la herramienta en sí. NO SE ELIMINA
        for (const herramienta of herramientas) {
            if (herramienta.idHerramienta == 1) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await backlogController.eliminarXProyecto(idProyecto);
                } else {
                    await backlogController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 2) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await EDTController.eliminarXProyecto(idProyecto);
                } else {
                    await EDTController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 3) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await actaConstitucionController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await actaConstitucionController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 4) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await cronogramaController.eliminarXProyecto(idProyecto);
                } else {
                    await cronogramaController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 5) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await catalogoRiesgosController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await catalogoRiesgosController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 6) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await catalogoInteresadosController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await catalogoInteresadosController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 7) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await matrizResponsabilidadController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await matrizResponsabilidadController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 8) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await matrizComunicacionesController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await matrizComunicacionesController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 9) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await autoEvaluacionController.eliminarXProyecto(
                        idProyecto
                    );
                } else {
                    await autoEvaluacionController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 10) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await retrospectivaController.eliminarXProyecto(idProyecto);
                } else {
                    await retrospectivaController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 11) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await actaReunionController.eliminarXProyecto(idProyecto);
                } else {
                    await actaReunionController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 12) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await equipoController.eliminarXProyecto(idProyecto);
                } else {
                    await equipoController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 13) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await presupuestoController.eliminarXProyecto(idProyecto);
                } else {
                    await presupuestoController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
            if (herramienta.idHerramienta == 15) {
                if (
                    herramienta.idHerramientaCreada == null ||
                    herramienta.idHerramientaCreada == undefined
                ) {
                    await planCalidadController.eliminarXProyecto(idProyecto);
                } else {
                    await planCalidadController.eliminar(
                        herramienta.idHerramientaCreada
                    );
                }
            }
        }
    } catch (error) {
        console.log("Error al eliminar Proyecto", error);
    }
}

async function verInfoProyecto(req, res, next) {
    const { idProyecto } = req.params;
    let query = `CALL VER_INFO_PROYECTO_X_ID_PROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        const infoProyecto = results[0];

        res.status(200).json({
            infoProyecto,
            message: "Info de proyecto listada correctamente",
        });
    } catch (error) {
        console.error("Error al obtener info del proyecto:", error);
        res.status(500).send(
            "Error al obtener info del proyecto: " + error.message
        );
    }
}

async function agregarUsuariosAProyecto(req, res, next) {
    const { usuarios, idProyecto } = req.body;
    let query = `CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);`;
    try {
        for (const usuario of usuarios) {
            const [results] = await connection.query(query, [
                usuario.idUsuario,
                usuario.idRol,
                idProyecto,
            ]);
            const successRes = results[0];
        }
        res.status(200).json({
            message: "Usuario agregado correctamente",
        });
    } catch (error) {
        console.error("Error al agregar usuario: ", error);
        res.status(500).send("Error al agregar usuario: " + error.message);
    }
}

async function eliminarUsuarioDeProyecto(req, res, next) {
    const { idUsuario, idProyecto } = req.body;
    let query = `CALL ELIMINAR_USUARIO_X_ID_PROYECTO(?,?);`;
    try {
        const [results] = await connection.query(query, [
            idUsuario,
            idProyecto,
        ]);
        const successRes = results[0];
        res.status(200).json({
            message: "Usuario eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        res.status(500).send("Error al eliminar usuario: " + error.message);
    }
}

async function eliminarHerramientaDeProyecto(req, res, next) {
    const { idProyecto, idHerramienta, idHerramientaCreada } = req.body;

    //esto actualiza HerramientaXProyecto (elimina la linea de la herramienta)
    const query = `CALL ELIMINAR_HERRAMIENTA_DE_HERRAMIENTA_X_PROYECTO(?,?);`;
    try {
        const [results] = await connection.query(query, [
            idProyecto,
            idHerramienta,
        ]);

        if (idHerramienta == 1) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await backlogController.eliminarXProyecto(idProyecto);
            } else {
                await backlogController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 2) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await EDTController.eliminarXProyecto(idProyecto);
            } else {
                await EDTController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 3) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await actaConstitucionController.eliminarXProyecto(idProyecto);
            } else {
                await actaConstitucionController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 4) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await cronogramaController.eliminarXProyecto(idProyecto);
            } else {
                await cronogramaController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 5) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await catalogoRiesgosController.eliminarXProyecto(idProyecto);
            } else {
                await catalogoRiesgosController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 6) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await catalogoInteresadosController.eliminarXProyecto(
                    idProyecto
                );
            } else {
                await catalogoInteresadosController.eliminar(
                    idHerramientaCreada
                );
            }
        }
        if (idHerramienta == 7) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await matrizResponsabilidadController.eliminarXProyecto(
                    idProyecto
                );
            } else {
                await matrizResponsabilidadController.eliminar(
                    idHerramientaCreada
                );
            }
        }
        if (idHerramienta == 8) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await matrizComunicacionesController.eliminarXProyecto(
                    idProyecto
                );
            } else {
                await matrizComunicacionesController.eliminar(
                    idHerramientaCreada
                );
            }
        }
        if (idHerramienta == 9) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await autoEvaluacionController.eliminarXProyecto(idProyecto);
            } else {
                await autoEvaluacionController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 10) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await retrospectivaController.eliminarXProyecto(idProyecto);
            } else {
                await retrospectivaController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 11) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await actaReunionController.eliminarXProyecto(idProyecto);
            } else {
                await actaReunionController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 12) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await equipoController.eliminarXProyecto(idProyecto);
            } else {
                await equipoController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 13) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await presupuestoController.eliminarXProyecto(idProyecto);
            } else {
                await presupuestoController.eliminar(idHerramientaCreada);
            }
        }
        if (idHerramienta == 15) {
            if (
                idHerramientaCreada == null ||
                idHerramientaCreada == undefined
            ) {
                await planCalidadController.eliminarXProyecto(idProyecto);
            } else {
                await planCalidadController.eliminar(idHerramientaCreada);
            }
        }

        res.status(200).json({
            message: "Herramientas eliminada exitosamente",
        });
        console.log(`Se elimino la herramienta de proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error al elimnar la herramienta del proyecto: ", error);
        res.status(500).send(
            "Error al elimnar la herramienta del proyecto: " + error.message
        );
    }
}

async function agregarHerramientaAProyecto(req, res, next) {
    const { idProyecto, idHerramienta } = req.body;

    try {
        let idDeHerramientaCreada = 0;
        if (idHerramienta === 3) {
            //Acta de Constitucion
            query = `CALL INSERTAR_ACTA_CONSTITUCION(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idActaConstitucion = results[0][0].idActaConstitucion;
            const [detalleAC] = await connection.query(`
                CALL INSERTAR_DETALLEAC_CREADO(${idActaConstitucion});
                `);
            idDeHerramientaCreada = idActaConstitucion;
        }

        if (idHerramienta === 5) {
            //Catalogo de riesgo
            query = `CALL INSERTAR_CATALOGO_RIESGO(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idCatalogo = results[0][0].idCatalogo;

            idDeHerramientaCreada = idCatalogo;
        }

        if (idHerramienta === 6) {
            //Catalogo de interesados
            query = `CALL INSERTAR_CATALOGO_INTERESADO(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idCatalogoInteresado = results[0][0].idCatalogoInteresado;

            idDeHerramientaCreada = idCatalogoInteresado;
        }

        if (idHerramienta === 7) {
            //Matriz de responsabilidad
            query = `CALL INSERTAR_MATRIZ_RESPONSABILIDAD(?);`;
            query1 = `CALL INSERTAR_RESPONSABILIDADROL_X_IDMATRIZ(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idMatrizResponsabilidad =
                results[0][0].idMatrizResponsabilidad;
            const [results1] = await connection.query(query1, [
                idMatrizResponsabilidad,
            ]);

            console.log("ID DE ESTO => " + idMatrizResponsabilidad);
            idDeHerramientaCreada = idMatrizResponsabilidad;
        }

        if (idHerramienta === 8) {
            //Matriz de comunicacion
            query = `CALL INSERTAR_MATRIZ_COMUNICACION(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idMatrizComunicacion = results[0][0].idMatrizComunicacion;

            idDeHerramientaCreada = idMatrizComunicacion;
        }

        if (idHerramienta === 9) {
            //Autoevaluacion
            query = `CALL INSERTAR_AUTOEVALUACION(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idAutoevaluacion = results[0][0].idAutoevaluacion;

            idDeHerramientaCreada = idAutoevaluacion;
        }

        if (idHerramienta === 10) {
            //Retrospectiva
            query = `CALL INSERTAR_RETROSPECTIVA(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idRetrospectiva = results[0][0].idRetrospectiva;

            idDeHerramientaCreada = idRetrospectiva;
        }

        if (idHerramienta === 11) {
            //Acta de reunion
            query = `CALL INSERTAR_ACTA_REUNION(?);`;
            const [results] = await connection.query(query, [idProyecto]);
            const idActaReunion = results[0][0].idActaReunion;

            idDeHerramientaCreada = idActaReunion;
        }

        if (idHerramienta === 12) {
            //Equipo
            console.log("Llegue a recibir solicitud insertar equipo");
            const query = `CALL INSERTAR_HERRAMIENTA_X_PROYECTO(?,?,?);`;
            const query1 = `CALL INSERTAR_ROL_MIEMBRO_LIDER(?);`;
            const [results] = await connection.query(query, [
                idProyecto,
                12,
                null,
            ]);
            const idEquipo = results[0][0].idEquipo;
            console.log(`Se creo el equipo${idEquipo}!`);
            const [results1] = await connection.query(query1, [idProyecto]);

            idDeHerramientaCreada = null; //????????????????????????????????????????
        }
        if (idHerramienta === 15) {
            // Repositorio de documentos
            query = `CALL INSERTAR_PLAN_CALIDAD(?);`;
            const [results] = await connection.query(query, [
                idProyecto,
            ]);
            const idPlanCalidad = results[0][0].idPlanCalidad;

            idDeHerramientaCreada = idPlanCalidad;
        }

        res.status(200).json({
            message: "Herramientas agregada exitosamente",
        });
        console.log(`Se agrego la herramienta de proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error al agregar la herramienta del proyecto: ", error);
        res.status(500).send(
            "Error al agregar la herramienta del proyecto: " + error.message
        );
    }
}

module.exports = {
    crear,
    insertarUsuarioXRolXProyecto,
    listarProyectosUsuario,
    listarProyectosXNombre,
    listarProyectoYGrupoProyecto,
    listarUsuariosXRolXProyecto,
    listarUsuariosXProyecto,
    eliminar,
    verInfoProyecto,
    agregarUsuariosAProyecto,
    eliminarUsuarioDeProyecto,
    eliminarHerramientaDeProyecto,
    agregarHerramientaAProyecto,
};
