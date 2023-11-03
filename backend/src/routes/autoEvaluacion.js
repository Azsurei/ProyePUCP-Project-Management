const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");

routerAutoEvaluacion.post("/crearAutoEvaluacion", autoEvaluacionController.crearAutoEvaluacion);
routerAutoEvaluacion.get("/listarTodasAutoEvaluacion", autoEvaluacionController.listarTodasAutoEvaluacion);
routerAutoEvaluacion.get("/listarAutoEvaluacion/:idProyecto/:idUsuario", autoEvaluacionController.listarAutoEvaluacion);
routerAutoEvaluacion.put("/actualizarAutoEvaluacion", autoEvaluacionController.actualizarAutoEvaluacion);

module.exports.routerAutoEvaluacion = routerAutoEvaluacion;