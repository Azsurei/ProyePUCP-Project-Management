const express = require("express");
const routerActaConstitucion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const actaConstitucionController = require("../controllers/actaConstitucionController");

routerActaConstitucion.get("/listarActaConstitucion/:idProyecto", actaConstitucionController.listar);
routerActaConstitucion.put("/modificarCampos", actaConstitucionController.modificarCampos);
routerActaConstitucion.get("/listarInteresados",verifyToken, actaConstitucionController.listarInteresados);
routerActaConstitucion.post("/insertarInteresado",verifyToken, actaConstitucionController.insertarInteresado);
routerActaConstitucion.get("/listarHito",verifyToken, actaConstitucionController.listarHito);
routerActaConstitucion.post("/insertarHito",verifyToken, actaConstitucionController.insertarHito);


module.exports.routerActaConstitucion = routerActaConstitucion;