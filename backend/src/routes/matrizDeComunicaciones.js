const express = require("express");
const routerMatrizComunicaciones = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");

routerMatrizComunicaciones.get("/listarCanales", matrizComunicacionesController.listarCanales);
routerMatrizComunicaciones.get("/listarFrecuencia", matrizComunicacionesController.listarFrecuencia);
routerMatrizComunicaciones.get("/listarFormato", matrizComunicacionesController.listarFormato);
routerMatrizComunicaciones.get("/listarMatrizComunicacion/:idProyecto", matrizComunicacionesController.listarMatrizComunicacion);
routerMatrizComunicaciones.post("/insertarMatrizComunicacion", matrizComunicacionesController.insertarMatrizComunicacion);
routerMatrizComunicaciones.put("/modificarMatrizComunicacion", matrizComunicacionesController.modificarMatrizComunicacion);
routerMatrizComunicaciones.get("/listarComunicacion/:idComunicacion", matrizComunicacionesController.listarComunicacion);

module.exports.routerMatrizComunicaciones = routerMatrizComunicaciones;