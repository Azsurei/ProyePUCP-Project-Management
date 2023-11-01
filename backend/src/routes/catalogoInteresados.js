const express = require("express");
const routerCatalogoInteresados = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoInteresadosController = require("../controllers/catalogoInteresados/catalogoInteresadosController");

routerCatalogoInteresados.get("/listarAutoridad", catalogoInteresadosController.listarAutoridad);
routerCatalogoInteresados.get("/listarAdhesion", catalogoInteresadosController.listarAdhesion);
routerCatalogoInteresados.post("/insertarInteresado", catalogoInteresadosController.insertarInteresado);

module.exports.routerCatalogoInteresados = routerCatalogoInteresados;