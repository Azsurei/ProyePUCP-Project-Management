const express = require('express');
const connection = require('../config/db');
const routerEquipo = express.Router();
const { verifyToken } = require('../middleware/middlewares');
const equipoController = require('../controllers/equipo/equipoController');


routerEquipo.post("/insertarEquipoYParticipantes",equipoController.insertarEquipoYParticipantes);
routerEquipo.get("/listarXIdProyecto/:idProyecto",equipoController.listarXIdProyecto);
routerEquipo.get("/listarEquipos",equipoController.listarEquipos);
module.exports.routerEquipo = routerEquipo;