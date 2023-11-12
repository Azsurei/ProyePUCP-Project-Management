const express = require("express");
const routerPlantillas = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const plantillaActaConstitucionController = require("../controllers/plantillas/plantillaActaConstitucionController");
const plantillaKanbanController = require("../controllers/plantillas/plantillaKanbanController");
const plantillaMRController = require("../controllers/plantillas/plantillaMRController");

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

module.exports.routerPlantillas = routerPlantillas;
