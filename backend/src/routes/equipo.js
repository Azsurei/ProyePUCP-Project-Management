const express = require('express');
const connection = require('../config/db');
const routerEquipo = express.Router();
const { verifyToken } = require('../middleware/middlewares');
const equipoController = require('../controllers/equipo/equipoController');

routerEquipo.post("/insertarEquipoYParticipantes",equipoController.insertarEquipoYParticipantes);
routerEquipo.get("/listarXIdProyecto/:idProyecto",equipoController.listarXIdProyecto);
routerEquipo.get("/listarEquiposYParticipantes/:idProyecto",equipoController.listarEquiposYParticipantes);
routerEquipo.get("/listarTareasDeXIdEquipo/:idEquipo",equipoController.listarTareasDeXIdEquipo);

module.exports.routerEquipo = routerEquipo;