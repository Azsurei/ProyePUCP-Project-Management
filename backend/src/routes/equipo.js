const express = require('express');
const connection = require('../config/db');
const routerEquipo = express.Router();
const { verifyToken } = require('../middleware/middlewares');
const equipoController = require('../controllers/equipo/equipoController');

routerEquipo.post("/insertarEquipoYParticipantes",verifyToken, equipoController.insertarEquipoYParticipantes);
routerEquipo.get("/listarXIdProyecto/:idProyecto",verifyToken, equipoController.listarXIdProyecto);
routerEquipo.get("/listarEquiposYParticipantes/:idProyecto",verifyToken, equipoController.listarEquiposYParticipantes);
routerEquipo.get("/listarTareasDeXIdEquipo/:idEquipo",verifyToken, equipoController.listarTareasDeXIdEquipo);
routerEquipo.delete("/eliminarEquipos",verifyToken, equipoController.eliminar);
routerEquipo.delete("/eliminarEquiposXProyecto",verifyToken, equipoController.eliminarXProyecto);

//Roles
routerEquipo.post("/insertarRol",verifyToken, equipoController.insertarRol);
routerEquipo.get("/listarRol/:idProyecto",verifyToken, equipoController.listarRol);
routerEquipo.delete("/eliminarRol",verifyToken, equipoController.eliminarRol);

routerEquipo.post("/insertarEquipo",verifyToken, equipoController.insertarEquipo);
routerEquipo.post("/insertarMiembros",verifyToken, equipoController.insertarMiembros);
routerEquipo.delete("/eliminarEquipo",verifyToken, equipoController.eliminarEquipo);

routerEquipo.put("/modificarMiembroEquipo",verifyToken, equipoController.modificarMiembroEquipo);
routerEquipo.delete("/eliminarMiembroEquipo",verifyToken, equipoController.eliminarMiembroEquipo);
routerEquipo.post("/insertarMiembrosEquipo",verifyToken, equipoController.insertarMiembrosEquipo);

routerEquipo.post("/rolEliminado",verifyToken, equipoController.rolEliminado);
routerEquipo.post("/rolAgregado",verifyToken, equipoController.rolAgregado);

module.exports.routerEquipo = routerEquipo;