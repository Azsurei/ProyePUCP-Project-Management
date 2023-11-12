const express = require("express");
const routerGrupoProyectos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const grupoProyectosController = require("../controllers/grupoProyectos/grupoProyectosController");

routerGrupoProyectos.post("/insertarGrupoProyectos", grupoProyectosController.insertarGrupoProyectos);
routerGrupoProyectos.get("/listarGruposProyecto", grupoProyectosController.listarGruposProyecto);

routerGrupoProyectos.get("/listarProyectosXGrupo/:idGrupoProyecto", grupoProyectosController.listarProyectosXGrupo);
routerGrupoProyectos.get("/listarDatosProyectosXGrupo/:idGrupoProyecto", grupoProyectosController.listarDatosProyectosXGrupo);

module.exports.routerGrupoProyectos = routerGrupoProyectos;