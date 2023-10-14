const express = require("express");
const connection = require("../config/db");
const routerActaConstitucion = express.Router();
const {verifyToken} = require('../middleware/middlewares');

//Lógica de Acta de constitucion
//Se crea el acta, con campos fijos ¿En qué parte del proceso se crea el acta de constitución?
//Se puede añadir campos a demanda en el Acta de Constitucion


module.exports.routerActaConstitucion = routerActaConstitucion;