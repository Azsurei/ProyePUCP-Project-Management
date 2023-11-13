const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");

routerAutoEvaluacion.post("/crearAutoEvaluacion", autoEvaluacionController.crearAutoEvaluacion);
routerAutoEvaluacion.get("/listarTodasAutoEvaluacion/:idProyecto", autoEvaluacionController.listarTodasAutoEvaluacion);
routerAutoEvaluacion.put("/activarAutoEvaluacion", autoEvaluacionController.activarAutoEvaluacion);
routerAutoEvaluacion.put("/finalizarAutoEvaluacion", autoEvaluacionController.finalizarAutoEvaluacion);
routerAutoEvaluacion.delete("/eliminarAutoEvaluacion", autoEvaluacionController.eliminar);
routerAutoEvaluacion.delete("/eliminarAutoEvaluacionXProyecto", autoEvaluacionController.eliminarXProyecto);

routerAutoEvaluacion.get("/listarAutoEvaluacion/:idProyecto/:idUsuario", autoEvaluacionController.listarAutoEvaluacion);
routerAutoEvaluacion.put("/actualizarAutoEvaluacion", autoEvaluacionController.actualizarAutoEvaluacion);

routerAutoEvaluacion.get("/listarAutoEvaluacionNotas/:idAutoEvaluacionXProyecto", autoEvaluacionController.listarAutoEvaluacionNotas);

module.exports.routerAutoEvaluacion = routerAutoEvaluacion;