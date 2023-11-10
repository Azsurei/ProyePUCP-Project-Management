const express = require("express");
const routerGrupoProyectos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const grupoProyectosController = require("../controllers/grupoProyectos/grupoProyectosController");

routerGrupoProyectos.post("/insertarGrupoProyectos", grupoProyectosController.insertarGrupoProyectos);

module.exports.routerGrupoProyectos = routerGrupoProyectos;