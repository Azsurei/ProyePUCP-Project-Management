const express = require("express");
const routerReporte = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const reporteEntregablesController = require("../controllers/reportes/reporteEntregablesController");
const reportePresupuestoController = require("../controllers/reportes/reportePresupuestoController");
const reporteController = require("../controllers/reportes/reporteController");
const reporteActaRiesgosController = require("../controllers/reportes/reporteActaRiesgosController");
const reporteTareasController = require("../controllers/reportes/reporteTareasController");
const reporteListaParcipiantesController = require("../controllers/reportes/reporteListaParticipantesController");
//Reportes
routerReporte.get("/listarReportesXIdProyecto/:idProyecto", reporteController.listarReportesXIdProyecto);

//Reporte presupuesto
routerReporte.post("/subirReportePresupuestoJSON", reportePresupuestoController.subirJSON);
routerReporte.post("/descargarExcelPresupuestoXIdArchivo",reportePresupuestoController.descargarExcel);
routerReporte.get("/obtenerJSONReportePresupuestoXIdArchivo/:idArchivo",reportePresupuestoController.obtenerJSON);
routerReporte.post("/crearExcelCajaEgresos",reportePresupuestoController.crearExcelCajaEgresos);
routerReporte.post("/crearExcelCajaEstimacion",reportePresupuestoController.crearExcelCajaEstimacion);
routerReporte.post("/crearExcelFlujoEstimacionCosto",reportePresupuestoController.crearExcelEstimacionCosto);

//Reporte entregables
routerReporte.post("/subirReporteEntregableJSON",reporteEntregablesController.subirJSON);
routerReporte.post("/descargarExcelReporteEntregableXIdArchivo",reporteEntregablesController.descargarExcel);
routerReporte.get("/obtenerJSONReporteEntregableXIdArchivo/:idArchivo",reporteEntregablesController.obtenerJSON);
routerReporte.get("/traerInformacionReporteEntregable/:idProyecto",reporteEntregablesController.traerInfoReporteEntregables);

//Reporte de riesgos
routerReporte.post("/subirReporteRiesgosJSON",reporteActaRiesgosController.subirJSON);
routerReporte.post("/descargarExcelReporteRiesgosXIdArchivo",reporteActaRiesgosController.descargarExcel);
routerReporte.get("/obtenerJSONReporteRiesgoXIdArchivo/:idArchivo",reporteActaRiesgosController.obtenerJSON);

//Reporte de tareas
routerReporte.post("/subirReporteTareasJSON",reporteTareasController.subirJSON);
routerReporte.post("/descargarExcelReporteTareasXIdArchivo",reporteTareasController.descargarExcel);
routerReporte.get("/obtenerJSONReporteTareasXIdArchivo/:idArchivo",reporteTareasController.obtenerJSON);
routerReporte.post("/probarExcelTareas",reporteTareasController.probarExcelTareas);


//Lista de participantes
routerReporte.post("/crearExcelListaParticipantes",reporteListaParcipiantesController.crearExcel);


module.exports.routerReporte = routerReporte;