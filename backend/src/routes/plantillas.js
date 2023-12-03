const express = require("express");
const routerPlantillas = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const plantillaActaConstitucionController = require("../controllers/plantillas/plantillaActaConstitucionController");
const plantillaKanbanController = require("../controllers/plantillas/plantillaKanbanController");
const plantillaMRController = require("../controllers/plantillas/plantillaMRController");
const plantillaCampoAdicionalController = require("../controllers/plantillas/plantillaCampoAdicionalController");

//Acta Constitucion
routerPlantillas.post("/guardarPlantillaAC",plantillaActaConstitucionController.guardarPlantillaAC);
routerPlantillas.get("/listarPlantillasAC/:idUsuario",plantillaActaConstitucionController.listarPlantillasAC);
routerPlantillas.get("/listarPlantillasACXNombre/:idUsuario/:nombre",plantillaActaConstitucionController.listarPlantillasACXNombre);
routerPlantillas.delete("/eliminarPlantillaAC",plantillaActaConstitucionController.eliminarPlantillaAC);
routerPlantillas.put("/seleccionarPlantillaAC",plantillaActaConstitucionController.seleccionarPlantillaAC);

//Kanban
routerPlantillas.post("/guardarPlantillaKanban",plantillaKanbanController.guardarPlantillaKanban);
routerPlantillas.get("/listarPlantillasKanban/:idUsuario",plantillaKanbanController.listarPlantillasKanban);
routerPlantillas.get("/listarPlantillasKanbanXNombre/:idUsuario/:nombre",plantillaKanbanController.listarPlantillasKanbanXNombre);
routerPlantillas.delete("/eliminarPlantillaKanban",plantillaKanbanController.eliminarPlantillaKanban);
routerPlantillas.put("/seleccionarPlantillaKanban",plantillaKanbanController.seleccionarPlantillaKanban);

//Matriz de Responsabilidades
routerPlantillas.post("/guardarPlantillaMR",plantillaMRController.guardarPlantillaMR);
routerPlantillas.get("/listarPlantillasMR/:idUsuario",plantillaMRController.listarPlantillasMR);
routerPlantillas.get("/listarPlantillasMRXNombre/:idUsuario/:nombre",plantillaMRController.listarPlantillasMRXNombre);
routerPlantillas.delete("/eliminarPlantillaMR",plantillaMRController.eliminarPlantillaMR);
routerPlantillas.put("/seleccionarPlantillaMR",plantillaMRController.seleccionarPlantillaMR);

//Campos Adicionales
routerPlantillas.post("/guardarPlantillaCA",plantillaCampoAdicionalController.guardarPlantillaCA);
routerPlantillas.get("/listarPlantillasCA/:idUsuario",plantillaCampoAdicionalController.listarPlantillasCA);
routerPlantillas.get("/listarPlantillasCAXNombre/:idUsuario/:nombre",plantillaCampoAdicionalController.listarPlantillasCAXNombre);
routerPlantillas.delete("/eliminarPlantillaCA",plantillaCampoAdicionalController.eliminarPlantillaCA);
routerPlantillas.get("/seleccionarPlantillaCA/idPlantillaCampoAdicional",plantillaCampoAdicionalController.seleccionarPlantillaCA);

module.exports.routerPlantillas = routerPlantillas;
