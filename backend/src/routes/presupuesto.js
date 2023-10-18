const express = require("express");
const routerPresupuesto = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const monedaController = require("../controllers/Presupuesto/monedaController");
const tipoIngresoController = require("../controllers/Presupuesto/tipoIngresoController");
const tipoTransaccionController = require("../controllers/Presupuesto/tipoTransaccionController");
const presupuestoController = require("../controllers/Presupuesto/presupuestoController");
const ingresoController = require("../controllers/Presupuesto/ingresoController");

routerPresupuesto.post("/insertarPresupuesto",presupuestoController.crear);
routerPresupuesto.post("/insertarIngreso",ingresoController.crear);
routerPresupuesto.post("/insertarLineaIngreso",ingresoController.crearLineaIngreso);

routerPresupuesto.get("/listarMonedasTodas",verifyToken, monedaController.listarTodas);
routerPresupuesto.get("/listarTipoIngresosTodos",verifyToken, tipoIngresoController.listarTodos);    
routerPresupuesto.get("/listarTipoTransaccionTodos",verifyToken, tipoTransaccionController.listarTodos); 

module.exports.routerPresupuesto = routerPresupuesto;