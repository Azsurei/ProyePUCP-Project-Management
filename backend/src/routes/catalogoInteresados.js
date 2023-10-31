const express = require("express");
const routerCatalogoInteresados = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoInteresadosController = require("../controllers/catalogoInteresados/catalogoInteresadosController");

routerCatalagoRiesgos.get("/listarAutoridad", catalogoInteresadosController.listarAutoridad);
routerCatalagoRiesgos.get("/listarAdhesion", catalogoInteresadosController.listarAdhesion);

module.exports.routerCatalogoInteresados = routerCatalogoInteresados;