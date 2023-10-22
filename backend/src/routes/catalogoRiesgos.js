const express = require("express");
const routerCatalagoRiesgos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");

routerCatalagoRiesgos.post("/insertarRiesgo", catalogoRiesgosController.insertarRiesgo);
routerCatalagoRiesgos.get("/listarRiesgos/:idProyecto", catalogoRiesgosController.listarRiesgos);
routerCatalagoRiesgos.get("/listarunRiesgo/:idRiesgo", catalogoRiesgosController.listarunRiesgo);
routerCatalagoRiesgos.delete("/eliminarunRiesgo", catalogoRiesgosController.eliminarunRiesgo);

routerCatalagoRiesgos.get("/listarProbabilidades", catalogoRiesgosController.listarProbabilidades);
routerCatalagoRiesgos.get("/listarImpacto", catalogoRiesgosController.listarImpacto);

//Plan Respuesta
routerCatalagoRiesgos.post("/insertarPlanRespuesta", catalogoRiesgosController.insertarPlanRespuesta);
routerCatalagoRiesgos.delete("/eliminarPlanRespuesta", catalogoRiesgosController.eliminarPlanRespuesta);

//Plan Contingencia
routerCatalagoRiesgos.post("/insertarPlanContingencia", catalogoRiesgosController.insertarPlanContingencia);
routerCatalagoRiesgos.delete("/eliminarPlanContingencia", catalogoRiesgosController.eliminarPlanContingencia);

//Responsables
routerCatalagoRiesgos.post("/insertarResponsable", catalogoRiesgosController.insertarResponsable);
routerCatalagoRiesgos.delete("/eliminarResponsable", catalogoRiesgosController.eliminarResponsable);

routerCatalagoRiesgos.delete("/eliminarRRC", catalogoRiesgosController.eliminarRRC);
routerCatalagoRiesgos.post("/insertarRRC", catalogoRiesgosController.insertarRRC);

module.exports.routerCatalagoRiesgos = routerCatalagoRiesgos;