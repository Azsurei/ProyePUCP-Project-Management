const express = require("express");
const routerCatalagoRiesgos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");

routerCatalagoRiesgos.delete("/eliminarCatalogoRiesgos",verifyToken,catalogoRiesgosController.eliminar);
routerCatalagoRiesgos.delete("/eliminarCatalogoRiesgosXProyecto",verifyToken,catalogoRiesgosController.eliminarXProyecto);

routerCatalagoRiesgos.post("/insertarRiesgo",verifyToken, catalogoRiesgosController.insertarRiesgo);
routerCatalagoRiesgos.get("/listarRiesgos/:idProyecto",verifyToken, catalogoRiesgosController.listarRiesgos);
routerCatalagoRiesgos.get("/listarunRiesgo/:idRiesgo",verifyToken, catalogoRiesgosController.listarunRiesgo);
routerCatalagoRiesgos.delete("/eliminarunRiesgo",verifyToken, catalogoRiesgosController.eliminarunRiesgo);

routerCatalagoRiesgos.get("/listarProbabilidades",verifyToken, catalogoRiesgosController.listarProbabilidades);
routerCatalagoRiesgos.get("/listarImpacto",verifyToken, catalogoRiesgosController.listarImpacto);

//Plan Respuesta
routerCatalagoRiesgos.post("/insertarPlanRespuesta",verifyToken, catalogoRiesgosController.insertarPlanRespuesta);
routerCatalagoRiesgos.delete("/eliminarPlanRespuesta",verifyToken, catalogoRiesgosController.eliminarPlanRespuesta);

//Plan Contingencia
routerCatalagoRiesgos.post("/insertarPlanContingencia",verifyToken, catalogoRiesgosController.insertarPlanContingencia);
routerCatalagoRiesgos.delete("/eliminarPlanContingencia",verifyToken, catalogoRiesgosController.eliminarPlanContingencia);

//Responsables
routerCatalagoRiesgos.post("/insertarResponsable",verifyToken, catalogoRiesgosController.insertarResponsable);
routerCatalagoRiesgos.delete("/eliminarResponsable",verifyToken, catalogoRiesgosController.eliminarResponsable);

routerCatalagoRiesgos.post("/insertarRRC",verifyToken, catalogoRiesgosController.insertarRRC);
routerCatalagoRiesgos.put("/modificarRiesgoRRC",verifyToken, catalogoRiesgosController.modificarRiesgoRRC);
routerCatalagoRiesgos.delete("/eliminarRRC",verifyToken, catalogoRiesgosController.eliminarRRC);

module.exports.routerCatalagoRiesgos = routerCatalagoRiesgos;