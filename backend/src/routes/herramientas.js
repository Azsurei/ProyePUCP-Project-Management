const express = require('express');
const connection = require('../config/db');
const routerHerramientas = express.Router();
const { verifyToken } = require('../middleware/middlewares');
const herramientaController = require("../controllers/herramientaController");

routerHerramientas.get("/listarHerramientas", verifyToken, herramientaController.listarHerramientas);
routerHerramientas.get("/:idProyecto/listarHerramientasDeProyecto", verifyToken, herramientaController.listarHerramientasDeProyecto);

module.exports.routerHerramientas = routerHerramientas;