const express = require("express");
const routerMatrizComunicaciones = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");

routerMatrizComunicaciones.get("/listarCanales", matrizComunicacionesController.listarCanales);
routerMatrizComunicaciones.get("/listarFrecuencia", matrizComunicacionesController.listarFrecuencia);
routerMatrizComunicaciones.get("/listarFormato", matrizComunicacionesController.listarFormato);
routerMatrizComunicaciones.get("/:idProyecto/listarMatrizComunicacion", matrizComunicacionesController.listarMatrizComunicacion);
routerMatrizComunicaciones.post("/insertarMatrizComunicacion", matrizComunicacionesController.insertarMatrizComunicacion);


module.exports.routerMatrizComunicaciones = routerMatrizComunicaciones;