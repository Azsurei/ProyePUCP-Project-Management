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
routerReporte.post("/descargarExcelPresupuestoXIdArchivo",reportePresupuestoController.descargarExcel);
routerReporte.get("/obtenerJSONReportePresupuestoXIdArchivo/:idArchivo",reportePresupuestoController.obtenerJSON);
routerReporte.post("/crearExcelCaja",reportePresupuestoController.crearExcelCaja);
//Reporte entregables
routerReporte.post("/subirReporteEntregableJSON",reporteEntregablesController.subirJSON);
routerReporte.post("/descargarExcelReporteEntregableXIdArchivo",reporteEntregablesController.descargarExcel);
routerReporte.get("/obtenerJSONReporteEntregableXIdArchivo/:idArchivo",reporteEntregablesController.obtenerJSON);
routerReporte.get("/traerInformacionReporteEntregable/:idProyecto",reporteEntregablesController.traerInfoReporteEntregables);

//Reporte de riesgos
routerReporte.post("/subirReporteRiesgosJSON",reporteActaRiesgosController.subirJSON);
routerReporte.post("/descargarExcelReporteRiesgosXIdArchivo",reporteActaRiesgosController.descargarExcel);
routerReporte.get("/obtenerJSONReporteRiesgoXIdArchivo/:idArchivo",reporteActaRiesgosController.obtenerJSON);

module.exports.routerReporte = routerReporte;