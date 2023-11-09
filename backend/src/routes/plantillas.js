const express = require("express");
const routerPlantillas = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const plantillaActaConstitucionController = require("../controllers/plantillas/plantillaActaConstitucionController");

//Acta Constitucion
routerPlantillas.post("/guardarPlantillaAC",plantillaActaConstitucionController.guardarPlantillaAC);
routerPlantillas.get("/listarPlantillasAC/:idUsuario",plantillaActaConstitucionController.listarPlantillasAC);

module.exports.routerPlantillas = routerPlantillas;
