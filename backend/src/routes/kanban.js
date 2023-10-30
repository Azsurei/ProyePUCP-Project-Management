const express = require("express");
const routerKanban = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const kanbanController = require("../controllers/kanbanController");

routerKanban.get("/listarColumnas/:idProyecto",verifyToken, kanbanController.listarColumnas);
routerKanban.get("/listarTareasTodasSinPosteriores/:idProyecto",verifyToken, kanbanController.listarTareasTodasSinPosteriores);
routerKanban.get("/listarColumnasYTareas/:idProyecto",verifyToken, kanbanController.listarColumnasYTareas);

module.exports.routerKanban = routerKanban;