const express = require("express");
const routerReporte = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const reporteEntregablesController = require("../controllers/reportes/reporteEntregablesController");
const reportePresupuestoController = require("../controllers/reportes/reportePresupuestoController");

//routerReportes.get("/generarReporteEntregables/:idProyecto",verifyToken, reporteEntregablesController.generarReporteEntregables);
//Reporte presupuesto
routerReporte.post("/generarReportePresupuesto", reportePresupuestoController.generarReporte);
routerReporte.get("/obtenerReportePresupuestoXFileId/:fileId",reportePresupuestoController.obtenerReporte);
routerReporte.post("/exportarReportePresupuestoXFileId",reportePresupuestoController.exportarReporteExcel);
//Reporte entregables
routerReporte.post("/generarReporteEntregable",reporteEntregablesController.generarReporte);
routerReporte.post("/exportarReporteEntregableXFileId",reporteEntregablesController.exportarReporteExcel);
routerReporte.get("/obtenerReporteEntregableXFileId/:fileId",reporteEntregablesController.obtenerReporte);
module.exports.routerReporte = routerReporte;