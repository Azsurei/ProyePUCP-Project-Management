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
const   routerProyecto = express.Router();
const routerMatrizResponsabilidad = require('./matrizResponsabilidad').routerMatrizResponsabilidad;
const routerPlantillas = require('./plantillas').routerPlantillas;
const routerGrupoProyectos = require('./grupoProyectos').routerGrupoProyectos;
const routerRepositorioDocumentos = require('./repositorioDocumento').routerRepositorioDocumentos;

const proyectoController = require("../controllers/proyectoController");
const routerPlanCalidad = require("./planCalidad").routerPlanCalidad;
const routerCamposAdicionales = require("./camposAdicionales").routerCamposAdicionales;

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
routerProyecto.use("/grupoProyectos", routerGrupoProyectos);
routerProyecto.use("/planCalidad", routerPlanCalidad);
routerProyecto.use("/camposAdicionales", routerCamposAdicionales);
routerProyecto.use("/repositorioDocumento", routerRepositorioDocumentos);

// Sobre el Proyecto
routerProyecto.post("/insertarProyecto", verifyToken, proyectoController.crear);
routerProyecto.post("/insertarUsuarioXRolXProyecto", verifyToken, proyectoController.insertarUsuarioXRolXProyecto);
routerProyecto.get("/listarProyectos", verifyToken, proyectoController.listarProyectosUsuario);
routerProyecto.post("/listaProyectosPorNombre", verifyToken, proyectoController.listarProyectosXNombre);
routerProyecto.get("/:idProyecto/listarProyectoYGrupoDeProyecto", verifyToken, proyectoController.listarProyectoYGrupoProyecto);

routerProyecto.delete("/eliminarProyecto",verifyToken, proyectoController.eliminar);
routerProyecto.delete("/eliminarHerramientaDeProyecto", verifyToken, proyectoController.eliminarHerramientaDeProyecto);
routerProyecto.post("/agregarHerramientaAProyecto", verifyToken, proyectoController.agregarHerramientaAProyecto);

routerProyecto.get("/verInfoProyecto/:idProyecto", verifyToken, proyectoController.verInfoProyecto);

routerProyecto.put("/actualizarDatos",verifyToken, proyectoController.actualizarDatos);

// Sobre Usuarios del Proyecto
routerProyecto.post("/listarUsuariosXidRolXidProyecto", verifyToken, proyectoController.listarUsuariosXRolXProyecto);
routerProyecto.get("/listarUsuariosXdProyecto/:idProyecto", proyectoController.listarUsuariosXProyecto);
routerProyecto.post("/agregarUsuariosAProyecto",verifyToken, proyectoController.agregarUsuariosAProyecto);
routerProyecto.delete("/eliminarUsuarioDeProyecto",verifyToken, proyectoController.eliminarUsuarioDeProyecto);

// Sobre Reportes
routerProyecto.use("/reporte", routerReporte);

module.exports.routerProyecto = routerProyecto;
