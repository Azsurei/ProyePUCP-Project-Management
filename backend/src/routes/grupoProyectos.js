const express = require("express");
const routerGrupoProyectos = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const grupoProyectosController = require("../controllers/grupoProyectos/grupoProyectosController");
const { verify } = require("jsonwebtoken");

routerGrupoProyectos.post("/insertarGrupoProyectos", verifyToken, grupoProyectosController.insertarGrupoProyectos);
routerGrupoProyectos.get("/listarGruposProyecto/:idUsuario", verifyToken, grupoProyectosController.listarGruposProyecto);
routerGrupoProyectos.get("/listarProyectosXGrupo/:idGrupoProyecto", verifyToken, grupoProyectosController.listarProyectosXGrupo);
routerGrupoProyectos.put("/modificarGrupoProyectos", verifyToken, grupoProyectosController.modificar);
routerGrupoProyectos.delete("/eliminarGrupoProyectos", verifyToken, grupoProyectosController.eliminar);
routerGrupoProyectos.get("/listarDatosProyectosXGrupo/:idGrupoProyecto", verifyToken, grupoProyectosController.listarDatosProyectosXGrupo);
routerGrupoProyectos.get("/listarGrupoYProyectosRelacionados/:idGrupoProyecto", verifyToken, grupoProyectosController.listarGrupoYProyectosRelacionados);
module.exports.routerGrupoProyectos = routerGrupoProyectos;