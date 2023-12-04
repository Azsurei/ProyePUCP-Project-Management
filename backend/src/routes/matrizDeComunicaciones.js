const express = require("express");
const routerMatrizComunicaciones = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");

routerMatrizComunicaciones.delete("/eliminarMatrizComunicaciones",verifyToken, matrizComunicacionesController.eliminar);
routerMatrizComunicaciones.delete("/eliminarMatrizComunicacionesXProyecto",verifyToken, matrizComunicacionesController.eliminarXProyecto);
routerMatrizComunicaciones.get("/listarCanales",verifyToken, matrizComunicacionesController.listarCanales);
routerMatrizComunicaciones.get("/listarFrecuencia",verifyToken, matrizComunicacionesController.listarFrecuencia);
routerMatrizComunicaciones.get("/listarFormato",verifyToken, matrizComunicacionesController.listarFormato);
routerMatrizComunicaciones.get("/listarMatrizComunicacion/:idProyecto",verifyToken, matrizComunicacionesController.listarMatrizComunicacion);
routerMatrizComunicaciones.post("/insertarMatrizComunicacion",verifyToken, matrizComunicacionesController.insertarMatrizComunicacion);
routerMatrizComunicaciones.put("/modificarMatrizComunicacion",verifyToken, matrizComunicacionesController.modificarMatrizComunicacion);
routerMatrizComunicaciones.get("/listarComunicacion/:idComunicacion",verifyToken, matrizComunicacionesController.listarComunicacion);
routerMatrizComunicaciones.delete("/eliminarComunicacion",verifyToken, matrizComunicacionesController.eliminarComunicacion);

module.exports.routerMatrizComunicaciones = routerMatrizComunicaciones;