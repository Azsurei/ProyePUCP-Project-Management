const express = require("express");
const routerReporte = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const reporteEntregablesController = require("../controllers/reportes/reporteEntregablesController");
const reportePresupuestoController = require("../controllers/reportes/reportePresupuestoController");

//routerReportes.get("/generarReporteEntregables/:idProyecto",verifyToken, reporteEntregablesController.generarReporteEntregables);
//Reporte presupuesto
routerReporte.post("/generarReportePresupuesto", reportePresupuestoController.generarReporte);

//Reporte entregables
routerReporte.post("/generarReporteEntregable",reporteEntregablesController.generarReporte);

module.exports.routerReporte = routerReporte;