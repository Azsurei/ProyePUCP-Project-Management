const express = require("express");
const routerCatalagoRiesgos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");

routerCatalagoRiesgos.delete("/eliminarCatalogoRiesgos", catalogoRiesgosController.eliminar);
routerCatalagoRiesgos.delete("/eliminarCatalogoRiesgosXProyecto", catalogoRiesgosController.eliminarXProyecto);

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

routerCatalagoRiesgos.post("/insertarRRC", catalogoRiesgosController.insertarRRC);
routerCatalagoRiesgos.put("/modificarRiesgoRRC", catalogoRiesgosController.modificarRiesgoRRC);
routerCatalagoRiesgos.delete("/eliminarRRC", catalogoRiesgosController.eliminarRRC);

module.exports.routerCatalagoRiesgos = routerCatalagoRiesgos;