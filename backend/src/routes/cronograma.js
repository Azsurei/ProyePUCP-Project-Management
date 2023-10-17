const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronogramaController");
const tareaController = require("../controllers/tareaController");

routerCronograma.post("/insertarCronograma",verifyToken, cronogramaController.crear);
routerCronograma.post("/insertarTarea", tareaController.crear);

routerCronograma.put("/actualizarCronograma", cronogramaController.actualizar);
routerCronograma.post("/listarCronograma", cronogramaController.listar);

module.exports.routerCronograma = routerCronograma;