const express = require("express");
const routerMatrizResponsabilidad = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");

routerMatrizResponsabilidad.delete("/eliminarMatrizResponsabilidades",verifyToken, matrizResponsabilidadController.eliminar);
routerMatrizResponsabilidad.delete("/eliminarMatrizResponsabilidadesXProyecto",verifyToken, matrizResponsabilidadController.eliminarXProyecto);

routerMatrizResponsabilidad.delete("/eliminarEntregableXResponsabilidadRol",verifyToken, matrizResponsabilidadController.eliminarEntregableXResponsabilidadRol);

routerMatrizResponsabilidad.post("/insertarResponsabilidad",verifyToken, matrizResponsabilidadController.insertarResponsabilidad);
routerMatrizResponsabilidad.put("/modificarResponsabilidad",verifyToken, matrizResponsabilidadController.modificarResponsabilidad);
routerMatrizResponsabilidad.get("/listarResponsabilidad/:idProyecto",verifyToken, matrizResponsabilidadController.listarResponsabilidad);
routerMatrizResponsabilidad.delete("/eliminarResponsabilidad",verifyToken, matrizResponsabilidadController.eliminarResponsabilidad);
routerMatrizResponsabilidad.get("/listarRol/:idProyecto",verifyToken, matrizResponsabilidadController.listarRol);
routerMatrizResponsabilidad.get("/listarEntregables/:idProyecto",verifyToken, matrizResponsabilidadController.listarEntregables);

routerMatrizResponsabilidad.put("/actualizarEntregables",verifyToken, matrizResponsabilidadController.actualizarEntregables);
routerMatrizResponsabilidad.post("/insertarEntregableXResponsabilidadXRol",verifyToken, matrizResponsabilidadController.insertarEntregableXResponsabilidadXRol);
routerMatrizResponsabilidad.get("/listarEntregablesXProyecto/:idProyecto",verifyToken, matrizResponsabilidadController.listarEntregablesXProyecto);

routerMatrizResponsabilidad.get("/listarParticipantes/:idProyecto",verifyToken, matrizResponsabilidadController.listarParticipantes);

module.exports.routerMatrizResponsabilidad = routerMatrizResponsabilidad;