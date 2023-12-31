const express = require("express");
const routerKanban = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const kanbanController = require("../controllers/kanbanController");

routerKanban.get("/listarColumnas/:idProyecto",verifyToken, kanbanController.listarColumnas);
routerKanban.get("/listarTareasTodasSinPosteriores/:idProyecto",verifyToken, kanbanController.listarTareasTodasSinPosteriores);
routerKanban.get("/listarColumnasYTareas/:idProyecto/:idCronograma",verifyToken, kanbanController.listarColumnasYTareas);
routerKanban.post("/cambiarPosicionTarea",verifyToken, kanbanController.cambiarPosicionTarea);
routerKanban.post("/crearColumna",verifyToken, kanbanController.crearColumna);
routerKanban.post("/cambiarPosicionColumna",verifyToken, kanbanController.cambiarPosicionColumna);
routerKanban.post("/renombarColumna",verifyToken, kanbanController.renombrarColumna);
routerKanban.post("/eliminarColumna",verifyToken, kanbanController.eliminarColumna);

routerKanban.get("/verInfoTarea/:idTarea",verifyToken, kanbanController.listarInfoTarea);

module.exports.routerKanban = routerKanban;