const express = require("express");
const routerRetrospectiva = express.Router();
const retrospectivaController = require("../controllers/retrospectiva/retrospectivaController");
const lineaRetrospectivaController = require("../controllers/retrospectiva/lineaRetrospectivaController");

routerRetrospectiva.post("/insertarLineaRetrospectiva", lineaRetrospectivaController.crear);
module.exports.routerRetrospectiva = routerRetrospectiva;   