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

module.exports.routerPlantillas = routerPlantillas;
