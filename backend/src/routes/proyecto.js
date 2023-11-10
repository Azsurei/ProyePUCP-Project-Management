const express = require("express");
const connection = require("../config/db");
const { verifyToken } = require("../middleware/middlewares");
const routerEDT = require("./EDT").routerEDT;
const routerActaConstitucion = require("./ActaConstitucion").routerActaConstitucion;
const routerBacklog = require("./backlog").routerBacklog;
const routerEquipo = require("./equipo").routerEquipo;
const routerCronograma = require('./cronograma').routerCronograma;
const routerPresupuesto = require('./presupuesto').routerPresupuesto;
const routerMatrizComunicaciones = require('./matrizDeComunicaciones').routerMatrizComunicaciones;
const routerAutoEvaluacion = require('./autoEvaluacion').routerAutoEvaluacion;
const routerCatalagoRiesgos = require('./catalogoRiesgos').routerCatalagoRiesgos;
const routerActaReunion = require('./actaReunion').routerActaReunion;
const routerKanban = require("./kanban").routerKanban;
const routerCatalogoInteresados = require('./catalogoInteresados').routerCatalogoInteresados;
const routerRetrospectiva = require("./retrospectiva").routerRetrospectiva;
const routerReporte = require("./reporte").routerReporte;
const routerProyecto = express.Router();
const routerMatrizResponsabilidad = require('./matrizResponsabilidad').routerMatrizResponsabilidad;
const routerPlantillas = require('./plantillas').routerPlantillas;

const proyectoController = require("../controllers/proyectoController");


routerProyecto.use("/backlog", routerBacklog);
routerProyecto.use("/EDT", routerEDT);
routerProyecto.use("/equipo", routerEquipo);
routerProyecto.use("/ActaConstitucion", routerActaConstitucion);
routerProyecto.use('/cronograma', routerCronograma);
routerProyecto.use("/presupuesto", routerPresupuesto);
routerProyecto.use("/matrizDeComunicaciones", routerMatrizComunicaciones);
routerProyecto.use("/autoEvaluacion", routerAutoEvaluacion);
routerProyecto.use("/catalogoRiesgos", routerCatalagoRiesgos);
routerProyecto.use("/actaReunion", routerActaReunion);
routerProyecto.use("/kanban",routerKanban);
routerProyecto.use("/catalogoInteresados", routerCatalogoInteresados);
routerProyecto.use("/retrospectiva", routerRetrospectiva);
routerProyecto.use("/matrizResponsabilidad", routerMatrizResponsabilidad);
routerProyecto.use("/plantillas", routerPlantillas);

routerProyecto.delete("/eliminarProyecto",proyectoController.eliminar); 

//sobre Reportes
routerProyecto.use("/reporte", routerReporte);


routerProyecto.post("/insertarProyecto", verifyToken, async (req, res) => {
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
        const query = `
        CALL INSERTAR_PROYECTO(?,?,?,?,?);
        `;

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
        ]); //cambie a 99 porque en front no contemplamos esto, conversar si maxCantParticipantes es un requisito con cliente

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
                for (const herramienta of herramientas) {
                    if (herramienta.idHerramienta === 1) {
                        //Product Backlog
                        query = `
                                    CALL INSERTAR_PRODUCT_BACKLOG(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idProductBacklog = results[0][0].idProductBacklog;
                    }

                    if (herramienta.idHerramienta === 2) {
                        //EDT
                        query = `
                                    CALL INSERTAR_EDT(?,?,?,?,?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                            "",
                            "",
                            "",
                            "",
                        ]);

                        const idEDT = results[0][0].idEDT;
                    }

                    if (herramienta.idHerramienta === 3) {
                        //Acta de constitucion
                        query = `
                                    CALL INSERTAR_ACTA_CONSTITUCION(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idActaConstitucion = results[0][0].idActaConstitucion;
                        const [detalleAC] = await connection.query(`
                            CALL INSERTAR_DETALLEAC_CREADO(${idActaConstitucion});
                            `);
                    }

                    if (herramienta.idHerramienta === 4) {
                        //Cronograma
                        query = `
                                    CALL INSERTAR_CRONOGRAMA(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idCronograma = results[0][0].idCronograma;
                    }

                    if (herramienta.idHerramienta === 5) {
                        //Catalogo de riesgo
                        query = `
                                    CALL INSERTAR_CATALOGO_RIESGO(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idCatalogo = results[0][0].idCatalogo;
                    }

                    if (herramienta.idHerramienta === 6) {
                        //Catalogo de interesados
                        query = `
                                    CALL INSERTAR_CATALOGO_INTERESADO(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idCatalogoInteresado =
                            results[0][0].idCatalogoInteresado;
                    }

                    if (herramienta.idHerramienta === 7) {
                        //Matriz de responsabilidad
                        query = `
                                    CALL INSERTAR_MATRIZ_RESPONSABILIDAD(?);
                                `;
                        query1 = `CALL INSERTAR_RESPONSABILIDADROL_X_IDMATRIZ(?);`;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idMatrizResponsabilidad =
                            results[0][0].idMatrizResponsabilidad;

                        const [results1] = await connection.query(query1, [idMatrizResponsabilidad]);
                        
                    }

                    if (herramienta.idHerramienta === 8) {
                        //Matriz de comunicacion
                        query = `
                                    CALL INSERTAR_MATRIZ_COMUNICACION(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idMatrizComunicacion =
                            results[0][0].idMatrizComunicacion;
                    }

                    if (herramienta.idHerramienta === 9) {
                        //Autoevaluacion
                        query = `
                                    CALL INSERTAR_AUTOEVALUACION(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idAutoevaluacion = results[0][0].idAutoevaluacion;
                    }

                    if (herramienta.idHerramienta === 10) {
                        //Retrospectiva
                        query = `
                                    CALL INSERTAR_RETROSPECTIVA(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idRetrospectiva = results[0][0].idRetrospectiva;
                    }

                    if (herramienta.idHerramienta === 11) {
                        //Acta de reunion
                        query = `
                                    CALL INSERTAR_ACTA_REUNION(?);
                                `;
                        const [results] = await connection.query(query, [
                            idProyecto,
                        ]);

                        const idActaReunion = results[0][0].idActaReunion;
                    }

                    if (herramienta.idHerramienta === 12) {
                        //Equipo
                        console.log("Llegue a recibir solicitud insertar equipo");
                        const query = `
                            CALL INSERTAR_HERRAMIENTA_X_PROYECTO(?,?,?);
                        `;
                        const query1 = `CALL INSERTAR_ROL_MIEMBRO_LIDER(?);`;
                            const [results] = await connection.query(query,[idProyecto, 12, null]);
                            const idEquipo = results[0][0].idEquipo;
                            console.log(`Se creo el equipo${idEquipo}!`);
                            const [results1] = await connection.query(query1,[idProyecto]);
    
                    }


                    if (herramienta.idHerramienta === 13){
                        //Presupeusto
                        query = "CALL INSERTAR_PRESUPUESTO(?,?,?,?)";
                        const [results] = await connection.query(query,[
                            idProyecto,2,0,0
                        ]);
                        //Esos dos 0s están por justo xdxd
                        const idPresupuesto = results[0][0].idPresupuesto
                    }

                    //13 (Presupuesto) si necesitaria su CALL INSERTAR_PRESUPUESTO, pero la tabla de presupuesto
                    //esta mal porque no tiene de columna idProyecto, no se le puede asociar a un proyecto aun

                    //insertamos los supervisores
                }

                try {
                    const query = `
                        CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
                        `;
                    for (const participante of participantesSupervisores) {
                        const [results] = await connection.query(query, [
                            participante.idUsuario,
                            2,
                            idProyecto,
                        ]);
                        const idUsuarioXRolProyecto =
                            results[0][0].idUsuarioXRolProyecto;
                        console.log(
                            `Se agrego el usuario ${
                                participante.idUsuario
                            } al proyecto ${idProyecto} con el rol ${2}`
                        );
                    }

                    //insertamos los miembros
                    try {
                        const query = `
                            CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
                            `;
                        for (const participante of participantesMiembros) {
                            const [results] = await connection.query(query, [
                                participante.idUsuario,
                                3,
                                idProyecto,
                            ]);
                            const idUsuarioXRolProyecto =
                                results[0][0].idUsuarioXRolProyecto;
                            console.log(
                                `Se agrego el usuario ${
                                    participante.idUsuario
                                } al proyecto ${idProyecto} con el rol ${3}`
                            );
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
});

routerProyecto.post(
    "/insertarUsuarioXRolXProyecto",
    verifyToken,
    async (req, res) => {
        const idUsuario = req.user.id;
        //Insertar query aca
        const { idRol, idProyecto } = req.body;
        console.log("Llegue a recibir insertar usuario por rol en proyecto ");
        const query = `
        CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
    `;
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
);

routerProyecto.get("/listarProyectos", verifyToken, async (req, res) => {
    console.log("Llegue a recibir solicitud listar proyecto");
    const idUsuario = req.user.id;

    let query = `
        CALL LISTAR_PROYECTOS_X_ID_USUARIO(?);
    `;
    try {
        const [results] = await connection.query(query, [idUsuario]);
        const proyectos = results[0];

        try {
            query = "CALL LISTAR_USUARIOS_X_ROL_X_PROYECTO(?,?)";

            //colocamos 3 para listar solo los miembros del equipo
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
            console.log(`Se listaron los proyectos con sus uruarios!`);
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
});

routerProyecto.post(
    "/listarProyectosPorNombre",
    verifyToken,
    async (req, res) => {
        console.log("Llegue a recibir solicitud listar proyecto por nombre");
        const { idUsuario,nombre } = req.body;

        const query = `
        CALL LISTAR_PROYECTOS_X_NOMBRE(?,?);
    `;
        try {
            const [results] = await connection.query(query, [idUsuario,nombre]);
            res.status(200).json({
                proyectos: results[0],
                message: "Proyectos obtenidos exitosamente",
            });
            console.log(results[0]);
        } catch (error) {
            console.error("Error al obtener los proyectos:", error);
            res.status(500).send(
                "Error al obtener los proyectos: " + error.message
            );
        }
    }
);

routerProyecto.get(
    "/:idProyecto/listarProyectoYGrupoDeProyecto",
    verifyToken,
    async (req, res) => {
        //Insertar query aca
        const { idProyecto } = req.params;
        console.log("Llegue a recibir solicitud listar Historias Prioridad");
        const query = `
        CALL LISTAR_PROYECTO_Y_GRUPO_DE_PROYECTO(?);
    `;
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
);

routerProyecto.post(
    "/listarUsuariosXidRolXidProyecto",
    verifyToken,
    async (req, res) => {
        //Insertar query aca
        const { idRol, idProyecto } = req.body;
        console.log(
            "Llegue a recibir solicitud listar usuarios por rol en proyecto con idRol = " + idRol + " y idProyecto = " + idProyecto
        );
        const query = `
        CALL LISTAR_USUARIOS_X_ROL_X_PROYECTO(?,?);
    `;
        try {
            const [results] = await connection.query(query, [
                idRol,
                idProyecto,
            ]);
            res.status(200).json({
                usuarios: results[0],
                message: "Usuarios por rol en proyecto obtenidos exitosamente",
            });
            console.log(results[0]);
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
);

routerProyecto.get("/listarUsuariosXdProyecto/:idProyecto", async (req, res) => {
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
            console.log(results[0]);
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
);



module.exports.routerProyecto = routerProyecto;
