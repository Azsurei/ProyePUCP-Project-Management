const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronograma/cronogramaController");
const tareaController = require("../controllers/cronograma/tareaController");


routerCronograma.post("/insertarCronograma",verifyToken, cronogramaController.crear);
routerCronograma.post("/insertarTarea", tareaController.crear);

routerCronograma.put("/actualizarTarea", verifyToken,tareaController.modificar);



routerCronograma.post("/listarCronograma", cronogramaController.listar);
routerCronograma.get("/listarTareasXidProyecto/:idProyecto", tareaController.listarXIdProyecto);
routerCronograma.get("/listarEntregablesXidProyecto/:idProyecto", cronogramaController.listarEntregablesXidProyecto);

routerCronograma.delete("/eliminarTarea", tareaController.eliminarTarea);

module.exports.routerCronograma = routerCronograma;