const express = require("express");
const connection = require("../config/db");
const routerEDT = express.Router();
const {verifyToken} = require('../middleware/middlewares');
const EDTController = require('../controllers/EDT/EDTController');
const entregableController = require('../controllers/EDT/entregableController');

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

routerEDT.post("/insertarEntregables",verifyToken, entregableController.insertarEntregables);
routerEDT.put("/modificarEntregables",verifyToken, entregableController.modificarEntregables);
routerEDT.delete("/eliminarEntregables",verifyToken, entregableController.eliminarEntregables);

routerEDT.post("/descargarExcelEDT",verifyToken, EDTController.descargarExcel);

//Arbol EDT
routerEDT.get("/listarColoresArbolNiveles/:idProyecto",verifyToken, EDTController.listarColoresArbolNiveles);
routerEDT.put("/modificarColoresArbolNiveles",verifyToken, EDTController.modificarColoresArbolNiveles);

module.exports.routerEDT = routerEDT;
