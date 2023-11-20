const express = require("express");
const routerPlanCalidad = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const planCalidadController = require("../controllers/planCalidad/planCalidadController");
const estandarCalidadController = require("../controllers/planCalidad/estandarCalidadController");
const actividadPrevencionController = require("../controllers/planCalidad/actividadPrevencionController");
const actividadControlCalidadController = require("../controllers/planCalidad/actividadControlCalidadController");
const metricaCalidadController = require("../controllers/planCalidad/metricaCalidadController");

// Plan de Calidad
routerPlanCalidad.post("/crearPlanCalidad", verifyToken, planCalidadController.crear);
routerPlanCalidad.get("/listarPlanCalidad/:idProyecto", verifyToken, planCalidadController.listar);
routerPlanCalidad.delete("/eliminarPlanCalidad", verifyToken, planCalidadController.eliminar);
routerPlanCalidad.delete("/eliminarPlanCalidadXIdProyecto", verifyToken, planCalidadController.eliminarXProyecto);
//nuevas Bruce
routerPlanCalidad.post("/insertarPlanCalidad", verifyToken, planCalidadController.insertarPlanCalidad);
routerPlanCalidad.get("/listarPlanCalidadXIdPlanCalidad/:idPlanCalidad", verifyToken, planCalidadController.listarXIdPlanCalidad);
routerPlanCalidad.put("/modificarPlanCalidad", verifyToken, planCalidadController.modificarPlanCalidad);
routerPlanCalidad.delete("/eliminarCamposDinamicos", verifyToken, planCalidadController.eliminarCamposDinamicos);

// Estandares de Calidad
routerPlanCalidad.post("/crearEstandarCalidad",verifyToken,estandarCalidadController.crear);
routerPlanCalidad.get("/listarEstandarCalidadXIdPlanCalidad/:idPlanCalidad",verifyToken,estandarCalidadController.listarXIdPlanCalidad);

// Actividades de Prevencion
routerPlanCalidad.post("/crearActividadPrevencion",verifyToken,actividadPrevencionController.crear);
routerPlanCalidad.delete("/listarActividadPrevencionXIdPlanCalidad/:idPlanCalidad",verifyToken,actividadPrevencionController.listarXIdPlanCalidad);

// Actividades de Control de Calidad
routerPlanCalidad.post("/crearActividadControlCalidad",verifyToken,actividadControlCalidadController.crear);
routerPlanCalidad.delete("/listarActividadControlCalidadXIdPlanCalidad/:idPlanCalidad",verifyToken,actividadControlCalidadController.listarXIdPlanCalidad);

// Métricas de Calidad
routerPlanCalidad.post("/crearMetricaCalidad",verifyToken,metricaCalidadController.crear);
routerPlanCalidad.get("/listarMetricaCalidadXIdPlanCalidad/:idPlanCalidad",verifyToken,metricaCalidadController.listarXIdPlanCalidad);
routerPlanCalidad.put("/modificarMetricaCalidad",verifyToken, metricaCalidadController.modificar);
routerPlanCalidad.delete("/eliminarMetricaCalidad",verifyToken,metricaCalidadController.eliminar);


module.exports.routerPlanCalidad = routerPlanCalidad;