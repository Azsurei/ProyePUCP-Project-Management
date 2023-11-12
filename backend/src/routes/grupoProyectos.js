const express = require("express");
const routerGrupoProyectos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const grupoProyectosController = require("../controllers/grupoProyectos/grupoProyectosController");

routerGrupoProyectos.post("/insertarGrupoProyectos", grupoProyectosController.insertarGrupoProyectos);
routerGrupoProyectos.get("/listarGruposProyecto/:idUsuario", grupoProyectosController.listarGruposProyecto);

//old
routerGrupoProyectos.get("/listarProyectosXGrupo/:idGrupoProyecto", grupoProyectosController.listarProyectosXGrupo);
//new
routerGrupoProyectos.get("/listarDatosProyectosXGrupo/:idGrupoProyecto", grupoProyectosController.listarDatosProyectosXGrupo);

module.exports.routerGrupoProyectos = routerGrupoProyectos;