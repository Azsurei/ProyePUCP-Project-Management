const express = require("express");
const routerReporte = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const reporteEntregablesController = require("../controllers/reportes/reporteEntregablesController");
const reportePresupuestoController = require("../controllers/reportes/reportePresupuestoController");
const reporteController = require("../controllers/reportes/reporteController");
const reporteActaRiesgosController = require("../controllers/reportes/reporteActaRiesgosController");

//Reportes
routerReporte.get("/listarReportesXIdProyecto/:idProyecto", reporteController.listarReportesXIdProyecto);

//Reporte presupuesto
routerReporte.post("/generarReportePresupuesto", reportePresupuestoController.generarReporte);
routerReporte.get("/obtenerReportePresupuestoXFileId/:fileId",reportePresupuestoController.obtenerReporte);
routerReporte.post("/exportarReportePresupuestoXFileId",reportePresupuestoController.exportarReporteExcel);

//Reporte entregables
routerReporte.get("/traerInformacionReporteEntregable/:idProyecto",reporteEntregablesController.traerInfoReporteEntregables);
routerReporte.post("/generarReporteEntregable",reporteEntregablesController.generarReporte);
routerReporte.post("/exportarReporteEntregableXFileId",reporteEntregablesController.exportarReporteExcel);
routerReporte.get("/obtenerReporteEntregableXFileId/:fileId",reporteEntregablesController.obtenerReporte);

//Reporte de riesgos
routerReporte.post("/generarReporteRiesgos",reporteActaRiesgosController.generarReporte);
routerReporte.post("/exportarReporteRiesgosXFileId",reporteActaRiesgosController.exportarReporteExcel);
routerReporte.get("/obtenerReporteRiesgoXFileId/:fileId",reporteActaRiesgosController.obtenerReporte);

module.exports.routerReporte = routerReporte;