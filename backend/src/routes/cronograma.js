const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronogramaController");
const tareaController = require("../controllers/tareaController");


routerCronograma.post("/insertarCronograma",verifyToken, cronogramaController.crear);
routerCronograma.post("/insertarTarea", verifyToken,tareaController.crear);
routerCronograma.put("/actualizarCronograma", verifyToken,cronogramaController.actualizar);
routerCronograma.get("/listarXidProyecto/:idProyecto", verifyToken,tareaController.listarXIdProyecto);

module.exports.routerCronograma = routerCronograma;