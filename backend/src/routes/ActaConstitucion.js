//Lógica de Acta de constitucion
//Se crea el acta, con campos fijos ¿En qué parte del proceso se crea el acta de constitución?
//Se puede añadir campos a demanda en el Acta de Constitucion
const express = require("express");
const routerActaConstitucion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const actaConstitucionController = require("../controllers/actaConstitucionController");

routerActaConstitucion.get("/listarActaConstitucion", actaConstitucionController.listar);
routerActaConstitucion.put("/modificarCampos", actaConstitucionController.modificarCampos);

module.exports.routerActaConstitucion = routerActaConstitucion;