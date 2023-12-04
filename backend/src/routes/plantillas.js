const express = require("express");
const routerPlantillas = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const plantillaActaConstitucionController = require("../controllers/plantillas/plantillaActaConstitucionController");
const plantillaKanbanController = require("../controllers/plantillas/plantillaKanbanController");
const plantillaMRController = require("../controllers/plantillas/plantillaMRController");
const plantillaCampoAdicionalController = require("../controllers/plantillas/plantillaCampoAdicionalController");

//Acta Constitucion
routerPlantillas.post("/guardarPlantillaAC",verifyToken, plantillaActaConstitucionController.guardarPlantillaAC);
routerPlantillas.get("/listarPlantillasAC/:idUsuario",verifyToken, plantillaActaConstitucionController.listarPlantillasAC);
routerPlantillas.get("/listarPlantillasACXNombre/:idUsuario/:nombre",verifyToken, plantillaActaConstitucionController.listarPlantillasACXNombre);
routerPlantillas.delete("/eliminarPlantillaAC",verifyToken, plantillaActaConstitucionController.eliminarPlantillaAC);
routerPlantillas.put("/seleccionarPlantillaAC",verifyToken, plantillaActaConstitucionController.seleccionarPlantillaAC);

//Kanban
routerPlantillas.post("/guardarPlantillaKanban",verifyToken, plantillaKanbanController.guardarPlantillaKanban);
routerPlantillas.get("/listarPlantillasKanban/:idUsuario",verifyToken, plantillaKanbanController.listarPlantillasKanban);
routerPlantillas.get("/listarPlantillasKanbanXNombre/:idUsuario/:nombre",verifyToken, plantillaKanbanController.listarPlantillasKanbanXNombre);
routerPlantillas.delete("/eliminarPlantillaKanban",verifyToken, plantillaKanbanController.eliminarPlantillaKanban);
routerPlantillas.put("/seleccionarPlantillaKanban",verifyToken, plantillaKanbanController.seleccionarPlantillaKanban);

//Matriz de Responsabilidades
routerPlantillas.post("/guardarPlantillaMR",verifyToken, plantillaMRController.guardarPlantillaMR);
routerPlantillas.get("/listarPlantillasMR/:idUsuario",verifyToken, plantillaMRController.listarPlantillasMR);
routerPlantillas.get("/listarPlantillasMRXNombre/:idUsuario/:nombre",verifyToken, plantillaMRController.listarPlantillasMRXNombre);
routerPlantillas.delete("/eliminarPlantillaMR",verifyToken, plantillaMRController.eliminarPlantillaMR);
routerPlantillas.put("/seleccionarPlantillaMR",verifyToken, plantillaMRController.seleccionarPlantillaMR);

//Campos Adicionales
routerPlantillas.post("/guardarPlantillaCA",verifyToken, plantillaCampoAdicionalController.guardarPlantillaCA);
routerPlantillas.get("/listarPlantillasCA/:idUsuario",verifyToken, plantillaCampoAdicionalController.listarPlantillasCA);
routerPlantillas.get("/listarPlantillasCAXNombre/:idUsuario/:nombre",verifyToken, plantillaCampoAdicionalController.listarPlantillasCAXNombre);
routerPlantillas.delete("/eliminarPlantillaCA",verifyToken, plantillaCampoAdicionalController.eliminarPlantillaCA);
routerPlantillas.post("/seleccionarPlantillaCA",verifyToken, plantillaCampoAdicionalController.seleccionarPlantillaCA);

module.exports.routerPlantillas = routerPlantillas;
