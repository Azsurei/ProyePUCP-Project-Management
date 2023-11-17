const express = require("express");
const connection = require("../config/db");
const routerEDT = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const EDTController = require('../controllers/EDT/EDTController');

//Hay modificar, eliminar que son post. No lo modifique por miedo XD

// EDT y ComponenteEDT
routerEDT.get(":idEDT/listarComponentesEDT", verifyToken, EDTController.listarComponentesEDT);
routerEDT.get("/:idProyecto/listarEDT", verifyToken, EDTController.listarEDT_X_IdProyecto);
routerEDT.get("/:idProyecto/listarComponentesEDTXIdProyecto", verifyToken, EDTController.listarComponentesEDT_X_IdProyecto);
routerEDT.post("/:idProyecto/insertarComponenteEDT", verifyToken, EDTController.insertarComponenteEDT);
routerEDT.post("/modificarComponenteEDT", verifyToken, EDTController.modificarComponenteEDT);
routerEDT.post("/eliminarComponenteEDT", verifyToken, EDTController.eliminarComponenteEDT);
routerEDT.post("/verInfoComponenteEDT", verifyToken, EDTController.verInfoComponenteEDT);
routerEDT.delete("/eliminarEDT",verifyToken, EDTController.eliminar);
routerEDT.delete("/eliminarEDTXProyecto",verifyToken, EDTController.eliminarXProyecto);

module.exports.routerEDT = routerEDT;
