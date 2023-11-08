const express = require("express");
const routerMatrizResponsabilidad = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");

routerMatrizResponsabilidad.get("/listarResponsabilidad/:idProyecto",matrizResponsabilidadController.listarResponsabilidad);
routerMatrizResponsabilidad.get("/listarRol/:idProyecto",matrizResponsabilidadController.listarRol);
routerMatrizResponsabilidad.get("/listarEntregables/:idProyecto",matrizResponsabilidadController.listarEntregables);

routerMatrizResponsabilidad.post("/insertarEntregableXResponsabilidadXRol",matrizResponsabilidadController.insertarEntregableXResponsabilidadXRol);
routerMatrizResponsabilidad.get("/listarEntregablesXProyecto/:idProyecto",matrizResponsabilidadController.listarEntregablesXProyecto);
routerMatrizResponsabilidad.put("/actualizarEntregablesXProyecto",matrizResponsabilidadController.actualizarEntregablesXProyecto);

module.exports.routerMatrizResponsabilidad = routerMatrizResponsabilidad;