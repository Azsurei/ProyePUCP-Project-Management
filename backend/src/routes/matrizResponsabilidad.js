const express = require("express");
const routerMatrizResponsabilidad = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");

routerMatrizResponsabilidad.post("/insertarResponsabilidad",matrizResponsabilidadController.insertarResponsabilidad);
routerMatrizResponsabilidad.get("/listarResponsabilidad/:idProyecto",matrizResponsabilidadController.listarResponsabilidad);
routerMatrizResponsabilidad.delete("/eliminarResponsabilidad",matrizResponsabilidadController.eliminarResponsabilidad);
routerMatrizResponsabilidad.get("/listarRol/:idProyecto",matrizResponsabilidadController.listarRol);
routerMatrizResponsabilidad.get("/listarEntregables/:idProyecto",matrizResponsabilidadController.listarEntregables);

routerMatrizResponsabilidad.put("/actualizarEntregables",matrizResponsabilidadController.actualizarEntregables);
routerMatrizResponsabilidad.post("/insertarEntregableXResponsabilidadXRol",matrizResponsabilidadController.insertarEntregableXResponsabilidadXRol);
routerMatrizResponsabilidad.get("/listarEntregablesXProyecto/:idProyecto",matrizResponsabilidadController.listarEntregablesXProyecto);

module.exports.routerMatrizResponsabilidad = routerMatrizResponsabilidad;