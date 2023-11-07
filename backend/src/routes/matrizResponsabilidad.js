const express = require("express");
const routerMatrizResponsabilidad = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");

routerMatrizResponsabilidad.get("/listarResponsabilidad/:idProyecto",matrizResponsabilidadController.listarResponsabilidad);
routerMatrizResponsabilidad.get("/listarRol/:idProyecto",matrizResponsabilidadController.listarRol);

module.exports.routerMatrizResponsabilidad = routerMatrizResponsabilidad;