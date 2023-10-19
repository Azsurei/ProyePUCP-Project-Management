const express = require("express");
const routerMatrizComunicaciones = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");

routerMatrizComunicaciones.get("/listarCanales", matrizComunicacionesController.listarCanales);
routerMatrizComunicaciones.get("/listarFrecuencia", matrizComunicacionesController.listarFrecuencia);
routerMatrizComunicaciones.get("/listarFormato", matrizComunicacionesController.listarFormato);


module.exports.routerMatrizComunicaciones = routerMatrizComunicaciones;