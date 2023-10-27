const express = require('express');
const connection = require('../config/db');
const routerEquipo = express.Router();
const { verifyToken } = require('../middleware/middlewares');
const equipoController = require('../controllers/equipo/equipoController');

routerEquipo.post("/insertarEquipoYParticipantes",equipoController.insertarEquipoYParticipantes);
routerEquipo.get("/listarXIdProyecto/:idProyecto",equipoController.listarXIdProyecto);
routerEquipo.get("/listarEquiposYParticipantes/:idProyecto",equipoController.listarEquiposYParticipantes);
routerEquipo.get("/listarTareasDeXIdEquipo/:idEquipo",equipoController.listarTareasDeXIdEquipo);

//Roles
routerEquipo.post("/insertarRol",equipoController.insertarRol);
routerEquipo.get("/listarRol/:idEquipo",equipoController.listarRol);
routerEquipo.delete("/eliminarRol",equipoController.eliminarRol);

routerEquipo.post("/insertarEquipo",equipoController.insertarEquipo);
routerEquipo.post("/insertarMiembros",equipoController.insertarMiembros);
routerEquipo.delete("/eliminarEquipo",equipoController.eliminarEquipo);

routerEquipo.put("/modificarMiembroEquipo",equipoController.modificarMiembroEquipo);
routerEquipo.delete("/eliminarMiembroEquipo",equipoController.eliminarMiembroEquipo);

module.exports.routerEquipo = routerEquipo;