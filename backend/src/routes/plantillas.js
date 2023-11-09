const express = require("express");
const routerPlantillas = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const plantillaActaConstitucionController = require("../controllers/plantillas/plantillaActaConstitucionController");
const plantillaKanbanController = require("../controllers/plantillas/plantillaKanbanController");

//Acta Constitucion
routerPlantillas.post("/guardarPlantillaAC",plantillaActaConstitucionController.guardarPlantillaAC);
routerPlantillas.get("/listarPlantillasAC/:idUsuario",plantillaActaConstitucionController.listarPlantillasAC);
routerPlantillas.delete("/eliminarPlantillaAC",plantillaActaConstitucionController.eliminarPlantillaAC);
routerPlantillas.put("/seleccionarPlantillaAC",plantillaActaConstitucionController.seleccionarPlantillaAC);

//Kanban
routerPlantillas.post("/guardarPlantillaKanban",plantillaKanbanController.guardarPlantillaKanban);
routerPlantillas.get("/listarPlantillasKanban/:idUsuario",plantillaKanbanController.listarPlantillasKanban);
routerPlantillas.delete("/eliminarPlantillaKanban",plantillaKanbanController.eliminarPlantillaKanban);
routerPlantillas.put("/seleccionarPlantillaKanban",plantillaKanbanController.seleccionarPlantillaKanban);

module.exports.routerPlantillas = routerPlantillas;
