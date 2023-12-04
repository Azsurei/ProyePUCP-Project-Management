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
routerReporte.get("/listarReportesXIdProyecto/:idProyecto",verifyToken, reporteController.listarReportesXIdProyecto);
routerReporte.put("/editarReporte",verifyToken, reporteController.modificar);
routerReporte.delete("/eliminarReporte", verifyToken, reporteController.eliminar);

//Reporte presupuesto
routerReporte.post("/subirReportePresupuestoJSON",verifyToken, reportePresupuestoController.subirJSON);
routerReporte.post("/descargarExcelPresupuestoXIdArchivo",verifyToken, reportePresupuestoController.descargarExcel);
routerReporte.get("/obtenerJSONReportePresupuestoXIdArchivo/:idArchivo",verifyToken, reportePresupuestoController.obtenerJSON);
routerReporte.post("/crearExcelCajaEgresos",verifyToken, reportePresupuestoController.crearExcelCajaEgresos);
routerReporte.post("/crearExcelCajaEstimacion",verifyToken, reportePresupuestoController.crearExcelCajaEstimacion);
routerReporte.post("/crearExcelFlujoEstimacionCosto",verifyToken, reportePresupuestoController.crearExcelEstimacionCosto);

//Reporte entregables
routerReporte.post("/subirReporteEntregableJSON",verifyToken, reporteEntregablesController.subirJSON);
routerReporte.post("/descargarExcelReporteEntregableXIdArchivo",verifyToken, reporteEntregablesController.descargarExcel);
routerReporte.get("/obtenerJSONReporteEntregableXIdArchivo/:idArchivo",verifyToken, reporteEntregablesController.obtenerJSON);
routerReporte.get("/traerInformacionReporteEntregable/:idProyecto",verifyToken, reporteEntregablesController.traerInfoReporteEntregables);

//Reporte de riesgos
routerReporte.post("/subirReporteRiesgosJSON",verifyToken, reporteActaRiesgosController.subirJSON);
routerReporte.post("/descargarExcelReporteRiesgosXIdArchivo",verifyToken, reporteActaRiesgosController.descargarExcel);
routerReporte.get("/obtenerJSONReporteRiesgoXIdArchivo/:idArchivo",verifyToken, reporteActaRiesgosController.obtenerJSON);

//Reporte de tareas
routerReporte.post("/subirReporteTareasJSON",verifyToken, reporteTareasController.subirJSON);
routerReporte.post("/descargarExcelReporteTareasXIdArchivo",verifyToken, reporteTareasController.descargarExcel);
routerReporte.get("/obtenerJSONReporteTareasXIdArchivo/:idArchivo",verifyToken, reporteTareasController.obtenerJSON);
routerReporte.post("/probarExcelTareas",verifyToken, reporteTareasController.probarExcelTareas);


//Lista de participantes
routerReporte.post("/crearExcelListaParticipantes",verifyToken, reporteListaParcipiantesController.crearExcel);


module.exports.routerReporte = routerReporte;