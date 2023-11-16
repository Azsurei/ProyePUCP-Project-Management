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
routerReporte.post("/subirReportePresupuestoJSON", reportePresupuestoController.subirJSON);
routerReporte.post("/descargarExcelPresupuestoXFileId",reportePresupuestoController.descargarExcel);
routerReporte.get("/obtenerJSONReportePresupuestoXFileId/:fileId",reportePresupuestoController.obtenerJSON);

//Reporte entregables
routerReporte.post("/subirReporteEntregableJSON",reporteEntregablesController.subirJSON);
routerReporte.post("/descargarExcelReporteEntregableXFileId",reporteEntregablesController.descargarExcel);
routerReporte.get("/obtenerJSONReporteEntregableXFileId/:fileId",reporteEntregablesController.obtenerJSON);
routerReporte.get("/traerInformacionReporteEntregable/:idProyecto",reporteEntregablesController.traerInfoReporteEntregables);

//Reporte de riesgos
routerReporte.post("/subirReporteRiesgosJSON",reporteActaRiesgosController.subirJSON);
routerReporte.post("/descargarExcelReporteRiesgosXFileId",reporteActaRiesgosController.descargarExcel);
routerReporte.get("/obtenerJSONReporteRiesgoXFileId/:fileId",reporteActaRiesgosController.obtenerJSON);

module.exports.routerReporte = routerReporte;