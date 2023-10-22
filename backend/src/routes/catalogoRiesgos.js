const express = require("express");
const routerCatalagoRiesgos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");

routerCatalagoRiesgos.post("/insertarRiesgo", catalogoRiesgosController.insertarRiesgo);
routerCatalagoRiesgos.get("/listarRiesgos/:idProyecto", catalogoRiesgosController.listarRiesgos);
routerCatalagoRiesgos.get("/listarunRiesgo/:idRiesgo", catalogoRiesgosController.listarunRiesgo);

routerCatalagoRiesgos.get("/listarProbabilidades", catalogoRiesgosController.listarProbabilidades);
routerCatalagoRiesgos.get("/listarImpacto", catalogoRiesgosController.listarImpacto);


module.exports.routerCatalagoRiesgos = routerCatalagoRiesgos;