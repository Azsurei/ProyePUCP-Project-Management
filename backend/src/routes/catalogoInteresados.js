const express = require("express");
const routerCatalogoInteresados = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoInteresadosController = require("../controllers/catalogoInteresados/catalogoInteresadosController");

routerCatalogoInteresados.delete("/eliminarCatalogoInteresados",verifyToken,catalogoInteresadosController.eliminar);
routerCatalogoInteresados.delete("/eliminarCatalogoInteresadosXProyecto",verifyToken,catalogoInteresadosController.eliminarXProyecto);

routerCatalogoInteresados.get("/listarAutoridad",verifyToken,catalogoInteresadosController.listarAutoridad);
routerCatalogoInteresados.get("/listarAdhesion",verifyToken,catalogoInteresadosController.listarAdhesion);

routerCatalogoInteresados.post("/insertarInteresado",verifyToken,catalogoInteresadosController.insertarInteresado);
routerCatalogoInteresados.get("/listarInteresados/:idProyecto",verifyToken,catalogoInteresadosController.listarInteresados);
routerCatalogoInteresados.get("/listarInteresado/:idInteresado",verifyToken,catalogoInteresadosController.listarInteresado);
routerCatalogoInteresados.delete("/eliminarInteresado",verifyToken,catalogoInteresadosController.eliminarInteresado);

routerCatalogoInteresados.delete("/eliminarRequirementStrategies",verifyToken, catalogoInteresadosController.eliminarRequirementStrategies);
routerCatalogoInteresados.post("/insertarRequirementStrategies",verifyToken, catalogoInteresadosController.insertarRequirementStrategies);
routerCatalogoInteresados.put("/modificarInteresados",verifyToken, catalogoInteresadosController.modificarInteresados);

module.exports.routerCatalogoInteresados = routerCatalogoInteresados;