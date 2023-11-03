const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");

routerAutoEvaluacion.post("/crearAutoEvaluacion", autoEvaluacionController.crearAutoEvaluacion);
routerAutoEvaluacion.get("/listarTodasAutoEvaluacion/:idProyecto", autoEvaluacionController.listarTodasAutoEvaluacion);
routerAutoEvaluacion.put("/activarAutoEvaluacion", autoEvaluacionController.activarAutoEvaluacion);
routerAutoEvaluacion.put("/finalizarAutoEvaluacion", autoEvaluacionController.finalizarAutoEvaluacion);

routerAutoEvaluacion.get("/listarAutoEvaluacion/:idProyecto/:idUsuario", autoEvaluacionController.listarAutoEvaluacion);
routerAutoEvaluacion.put("/actualizarAutoEvaluacion", autoEvaluacionController.actualizarAutoEvaluacion);

module.exports.routerAutoEvaluacion = routerAutoEvaluacion;