const express = require("express");
const routerRetrospectiva = express.Router();
const retrospectivaController = require("../controllers/retrospectiva/retrospectivaController");
const lineaRetrospectivaController = require("../controllers/retrospectiva/lineaRetrospectivaController");
const itemLineaRetrospectivaController = require("../controllers/retrospectiva/itemLineaRetrospectivaController");

routerRetrospectiva.delete("/eliminarRetrospectiva",retrospectivaController.eliminar);
routerRetrospectiva.delete("/eliminarRetrospectivaXProyecto",retrospectivaController.eliminarXProyecto);
//Lineas retrospectiva
routerRetrospectiva.post("/insertarLineaRetrospectiva", lineaRetrospectivaController.crear);
routerRetrospectiva.get("/listarLineasRetrospectivaXIdRetrospectiva/:idRetrospectiva", lineaRetrospectivaController.listarXIdRetrospectiva);
routerRetrospectiva.put("/modificarLineaRetrospectiva", lineaRetrospectivaController.modificar);
routerRetrospectiva.delete("/eliminarLineaRetrospectiva", lineaRetrospectivaController.eliminar);

// Criterios retrospectiva
routerRetrospectiva.get("/listarItemLineasRetrospectivaTodasXIdLineaRetrospectiva/:idLineaRetrospectiva", retrospectivaController.crear);
// Item Linea Retrospectiva
routerRetrospectiva.post("/insertarItemLineaRetrospectiva", itemLineaRetrospectivaController.crear);
routerRetrospectiva.get("/listarItemLineasRetrospectivaXIdLineaRetrospectiva/:idLineaRetrospectiva", itemLineaRetrospectivaController.listarXIdLineaRetrospectiva);
routerRetrospectiva.put("/modificarItemLineaRetrospectiva", itemLineaRetrospectivaController.modificar);
routerRetrospectiva.delete("/eliminarItemLineaRetrospectiva", itemLineaRetrospectivaController.eliminar);

module.exports.routerRetrospectiva = routerRetrospectiva;   