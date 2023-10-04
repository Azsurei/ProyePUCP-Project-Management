const express = require("express");
const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";
const routerEDT = require("./EDT").routerEDT;
const routerBacklog = require("./backlog").routerBacklog;

const routerProyecto = express.Router();

routerProyecto.use("/backlog", routerBacklog);
routerProyecto.use("/EDT", routerEDT);

routerProyecto.post("/insertarProyecto", async (req, res) => {
    const { tokenProyePUCP } = req.cookies;
    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;

        const { proyecto, herramientas, participantes } = req.body;

        console.log("Llegue a recibir solicitud creacion proyecto");

        let idProyecto;
        try {
            const query = `
            CALL INSERTAR_PROYECTO(?,?,?,?,?);
            `;

            const { nombre, maxCantParticipantes, fechaInicio, fechaFin } =
                proyecto;

            const [results] = await connection.query(query, [
                idUsuario,
                nombre,
                99,
                fechaInicio,
                fechaFin,
            ]); //cambie a 99 porque en front no contemplamos esto, conversar si maxCantParticipantes es un requisito con cliente
            idProyecto = results[0][0].idProyecto;
            //res.status(200).json({
            //idProyecto,
            //message: "Proyecto registrado exitosamente",

            //});
            console.log(`Se creo el proyecto ${idProyecto} con exito!`);
            //Recordar, este query crea el proyecto y asigna al usuario de creacion como el Jefe de proyecto en tabla UsuarioXRolXProyecto
        } catch (error) {
            console.error("Error en el registro del proyecto :", error);
            res.status(500).send(
                "Error en el registro del proyecto: " + error.message
            );
        }

        try {
            //sirve para registrar en la tabla HerramientaXProyecto, de esta reconoceremos facilmente que herramientas se deben mostrar listas a uso en el proyecto
            for (const herramienta of herramientas) {
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

        try {
            ///ahora, por cada herramienta, se creara en la DB y se asignara a proyecto
            const { idHerramienta, nombre, descripcion } = herramienta;
            let query;
            for (const herramienta of herramientas) {
                if (herramienta.idHerramienta === 1) {
                    //Product Backlog
                    query = `
                        CALL INSERTAR_PRODUCT_BACKLOG(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
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
                        idProyecto
                    ]);

                    const idActa = results[0][0].idActa;
                }

                if (herramienta.idHerramienta === 4) {
                    //Cronograma
                    query = `
                        CALL INSERTAR_CRONOGRAMA(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idCronograma = results[0][0].idCronograma;
                }

                if (herramienta.idHerramienta === 5) {
                    //Catalogo de riesgo
                    query = `
                        CALL INSERTAR_CATALOGO_RIESGO(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idCatalogo = results[0][0].idCatalogo;
                }

                if (herramienta.idHerramienta === 6) {
                    //Catalogo de interesados
                    query = `
                        CALL INSERTAR_CATALOGO_INTERESADO(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idCatalogoInteresado = results[0][0].idCatalogoInteresado;
                }

                if (herramienta.idHerramienta === 7) {
                    //Matriz de responsabilidad
                    query = `
                        CALL INSERTAR_MATRIZ_RESPONSABILIDAD(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idMatrizResponsabilidad = results[0][0].idMatrizResponsabilidad;
                }

                if (herramienta.idHerramienta === 8) {
                    //Matriz de comunicacion
                    query = `
                        CALL INSERTAR_MATRIZ_COMUNICACION(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idMatrizComunicacion = results[0][0].idMatrizComunicacion;
                }

                if (herramienta.idHerramienta === 9) {
                    //Autoevaluacion
                    query = `
                        CALL INSERTAR_AUTOEVALUACION(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idAutoevaluacion = results[0][0].idAutoevaluacion;
                }

                if (herramienta.idHerramienta === 10) {
                    //Retrospectiva
                    query = `
                        CALL INSERTAR_RETROSPECTIVA(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idRetrospectiva = results[0][0].idRetrospectiva;
                }

                if (herramienta.idHerramienta === 11) {
                    //Acta de reunion
                    query = `
                        CALL INSERTAR_ACTA_REUNION(?);
                    `;
                    const [results] = await connection.query(query, [
                        idProyecto
                    ]);

                    const idActaReunion = results[0][0].idActaReunion;
                }



                

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

        try {
            const query = `
            CALL INSERTAR_USUARIO_X_ROL_X_PROYECTO(?,?,?);
            `;
            for (const participante of participantes) {
                const [results] = await connection.query(query, [
                    participante.idUsuario,
                    participante.idRol,
                    participante.idProyecto,
                ]);
                const idUsuarioXRolProyecto = results[0][0].idProyecto;
                console.log(
                    `Se agrego el usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}`
                );
            }
        } catch (error) {
            console.error(
                `Error en el registro del usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}`,
                error
            );
            res.status(500).send(
                `Error en el registro del usuario ${participante.idUsuario} al proyecto ${participante.idProyecto} con el rol ${participante.idRol}` +
                    error.message
            );
        }
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
});

routerProyecto.post("/insertarUsuarioXRolXProyecto", async (req, res) => {
    const { tokenProyePUCP } = req.cookies;
    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;
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
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
});

routerProyecto.get("/listarProyectos", async (req, res) => {
    console.log("Llegue a recibir solicitud listar proyecto");
    const { tokenProyePUCP } = req.cookies;

    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;

        const query = `
            CALL LISTAR_PROYECTOS_X_ID_USUARIO(?);
        `;
        try {
            const [results] = await connection.query(query, [idUsuario]);
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
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
});

routerProyecto.post("/listarProyectosPorNombre", async (req, res) => {
    console.log("Llegue a recibir solicitud listar proyecto por nombre");
    //const { tokenProyePUCP } = req.cookies;

    try {
        //const payload = jwt.verify(tokenProyePUCP, secret);
        //console.log(payload);
        //const idUsuario = payload.user.id;
        const { nombre } = req.body;

        const query = `
            CALL LISTAR_PROYECTOS_X_NOMBRE(?);
        `;
        try {
            const [results] = await connection.query(query, [nombre]);
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
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
});

routerProyecto.get(
    "/:idProyecto/listarProyectoYGrupoDeProyecto",
    async (req, res) => {
        const { tokenProyePUCP } = req.cookies;
        try {
            const payload = jwt.verify(tokenProyePUCP, secret);
            console.log(payload);
            //Insertar query aca
            const { idProyecto } = req.params;
            console.log(
                "Llegue a recibir solicitud listar Historias Prioridad"
            );
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
                console.error(
                    "Error al obtener las historias prioridad:",
                    error
                );
                res.status(500).send(
                    "Error al obtener las historias prioridad: " + error.message
                );
            }
        } catch (error) {
            return res
                .status(401)
                .send(error.message + " invalid tokenProyePUCP token");
        }
    }
);

module.exports.routerProyecto = routerProyecto;
