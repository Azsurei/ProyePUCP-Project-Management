const express = require("express");
const routerRetrospectiva = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const retrospectivaController = require("../controllers/retrospectiva/retrospectivaController");
const lineaRetrospectivaController = require("../controllers/retrospectiva/lineaRetrospectivaController");
const itemLineaRetrospectivaController = require("../controllers/retrospectiva/itemLineaRetrospectivaController");

routerRetrospectiva.delete("/eliminarRetrospectiva",verifyToken, retrospectivaController.eliminar);
routerRetrospectiva.delete("/eliminarRetrospectivaXProyecto",verifyToken, retrospectivaController.eliminarXProyecto);
//Lineas retrospectiva
routerRetrospectiva.post("/insertarLineaRetrospectiva",verifyToken, lineaRetrospectivaController.crear);
routerRetrospectiva.get("/listarLineasRetrospectivaXIdRetrospectiva/:idRetrospectiva",verifyToken, lineaRetrospectivaController.listarXIdRetrospectiva);
routerRetrospectiva.put("/modificarLineaRetrospectiva",verifyToken, lineaRetrospectivaController.modificar);
routerRetrospectiva.delete("/eliminarLineaRetrospectiva",verifyToken, lineaRetrospectivaController.eliminar);

// Criterios retrospectiva
routerRetrospectiva.get("/listarItemLineasRetrospectivaTodasXIdLineaRetrospectiva/:idLineaRetrospectiva",verifyToken, retrospectivaController.crear);
// Item Linea Retrospectiva
routerRetrospectiva.post("/insertarItemLineaRetrospectiva",verifyToken, itemLineaRetrospectivaController.crear);
routerRetrospectiva.get("/listarItemLineasRetrospectivaXIdLineaRetrospectiva/:idLineaRetrospectiva",verifyToken, itemLineaRetrospectivaController.listarXIdLineaRetrospectiva);
routerRetrospectiva.put("/modificarItemLineaRetrospectiva",verifyToken, itemLineaRetrospectivaController.modificar);
routerRetrospectiva.delete("/eliminarItemLineaRetrospectiva",verifyToken, itemLineaRetrospectivaController.eliminar);

module.exports.routerRetrospectiva = routerRetrospectiva;   