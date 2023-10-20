const express = require("express");
const routerActaConstitucion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const actaConstitucionController = require("../controllers/actaConstitucionController");

routerActaConstitucion.get("/listarActaConstitucion/:idProyecto",verifyToken, actaConstitucionController.listar);
routerActaConstitucion.put("/modificarCampos",verifyToken, actaConstitucionController.modificarCampos);
routerActaConstitucion.post("/crearCampos", verifyToken, actaConstitucionController.crearCampos);
routerActaConstitucion.put("/eliminarCampo", verifyToken, actaConstitucionController.eliminarCampo);
routerActaConstitucion.get("/listarInteresados/:idProyecto",verifyToken, actaConstitucionController.listarInteresados);
routerActaConstitucion.post("/insertarInteresado",verifyToken, actaConstitucionController.insertarInteresado);

routerActaConstitucion.get("/listarHito/:idProyecto",verifyToken, actaConstitucionController.listarHito);
routerActaConstitucion.post("/insertarHito",verifyToken, actaConstitucionController.insertarHito);
routerActaConstitucion.put("/modificarHito",verifyToken, actaConstitucionController.modificarHito);
routerActaConstitucion.delete("/eliminarHito", actaConstitucionController.eliminarHito);


module.exports.routerActaConstitucion = routerActaConstitucion;