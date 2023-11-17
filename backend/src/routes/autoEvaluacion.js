const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");

routerAutoEvaluacion.post("/crearAutoEvaluacion",verifyToken, autoEvaluacionController.crearAutoEvaluacion);
routerAutoEvaluacion.get("/listarTodasAutoEvaluacion/:idProyecto",verifyToken, autoEvaluacionController.listarTodasAutoEvaluacion);
routerAutoEvaluacion.put("/activarAutoEvaluacion",verifyToken, autoEvaluacionController.activarAutoEvaluacion);
routerAutoEvaluacion.put("/finalizarAutoEvaluacion",verifyToken, autoEvaluacionController.finalizarAutoEvaluacion);
routerAutoEvaluacion.delete("/eliminarAutoEvaluacion",verifyToken, autoEvaluacionController.eliminar);
routerAutoEvaluacion.delete("/eliminarAutoEvaluacionXProyecto",verifyToken, autoEvaluacionController.eliminarXProyecto);

routerAutoEvaluacion.get("/listarAutoEvaluacion/:idProyecto/:idUsuario",verifyToken, autoEvaluacionController.listarAutoEvaluacion);
routerAutoEvaluacion.put("/actualizarAutoEvaluacion",verifyToken, autoEvaluacionController.actualizarAutoEvaluacion);

routerAutoEvaluacion.get("/listarAutoEvaluacionNotas/:idAutoEvaluacionXProyecto",verifyToken, autoEvaluacionController.listarAutoEvaluacionNotas);

module.exports.routerAutoEvaluacion = routerAutoEvaluacion;