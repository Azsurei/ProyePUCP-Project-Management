const express = require("express");
const routerReportes = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const reporteEntregablesController = require("../controllers/reportes/reporteEntregablesController");
//reportePresupuestoController....

routerReportes.get("/generarReporteEntregables/:idProyecto",verifyToken, reporteEntregablesController.generarReporteEntregables);


module.exports.routerReportes = routerReportes;