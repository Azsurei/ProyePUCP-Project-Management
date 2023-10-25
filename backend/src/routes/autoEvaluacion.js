const express = require("express");
const routerAutoEvaluacion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");

routerAutoEvaluacion.post("/crearAutoEvaluacion", autoEvaluacionController.crearAutoEvaluacion);
routerAutoEvaluacion.get("/listarAutoEvaluacion/:idProyecto/:idUsuario", autoEvaluacionController.listarAutoEvaluacion);

module.exports.routerAutoEvaluacion = routerAutoEvaluacion;