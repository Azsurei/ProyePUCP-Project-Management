const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronogramaController");

routerCronograma.post("/crearCronograma",verifyToken, cronogramaController.crear);

module.exports.routerCronograma = routerCronograma;