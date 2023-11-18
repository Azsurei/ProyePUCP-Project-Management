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

// Estandares de Calidad
routerPlanCalidad.post("/crearEstandarCalidad",verifyToken,estandarCalidadController.crear);
routerPlanCalidad.get("/listarEstandarCalidadXIdPlanCalidad",verifyToken,estandarCalidadController.listarXIdPlanCalidad);

// Actividades de Prevencion
routerPlanCalidad.post("/crearActividadPrevencion",verifyToken,actividadPrevencionController.crear);
routerPlanCalidad.delete("/listarActividadPrevencionXIdPlanCalidad",verifyToken,actividadPrevencionController.listarXIdPlanCalidad);

// Actividades de Control de Calidad
routerPlanCalidad.post("/crearActividadControlCalidad",verifyToken,actividadControlCalidadController.crear);
routerPlanCalidad.delete("/listarActividadControlCalidadXIdPlanCalidad",verifyToken,actividadControlCalidadController.listarXIdPlanCalidad);

// Métricas de Calidad
routerPlanCalidad.post("/crearMetricaCalidad",verifyToken,metricaCalidadController.crear);
routerPlanCalidad.delete("/listarMetricaCalidadXIdPlanCalidad",verifyToken,metricaCalidadController.listarXIdPlanCalidad);


module.exports.routerPlanCalidad = routerPlanCalidad;