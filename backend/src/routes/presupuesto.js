const express = require("express");
const routerPresupuesto = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const monedaController = require("../controllers/Presupuesto/monedaController");
const tipoIngresoController = require("../controllers/Presupuesto/tipoIngresoController");
const tipoTransaccionController = require("../controllers/Presupuesto/tipoTransaccionController");
const presupuestoController = require("../controllers/Presupuesto/presupuestoController");
const ingresoController = require("../controllers/Presupuesto/ingresoController");
const egresoController = require("../controllers/Presupuesto/egresoController");
const estimacionCostoController = require("../controllers/Presupuesto/estimacionCostoController");

//Presupuesto
routerPresupuesto.post("/insertarPresupuesto",presupuestoController.crear);
routerPresupuesto.get("/listarLineasTodas/:idProyecto",presupuestoController.listarLineasTodas);

//Listado monedas y tipos de transaccion e ingresos
routerPresupuesto.get("/listarMonedasTodas",verifyToken, monedaController.listarTodas);
routerPresupuesto.get("/listarTipoIngresosTodos",verifyToken, tipoIngresoController.listarTodos);    
routerPresupuesto.get("/listarTipoTransaccionTodos",verifyToken, tipoTransaccionController.listarTodos); 

// Ingresos
routerPresupuesto.post("/insertarIngreso",ingresoController.crear);
routerPresupuesto.post("/insertarLineaIngreso",ingresoController.crearLineaIngreso);
routerPresupuesto.delete("/eliminarLineaIngreso",ingresoController.eliminarLineaIngreso);

// Egresos
routerPresupuesto.post("/insertarEgreso",egresoController.crear);
routerPresupuesto.post("/insertarLineaEgreso",egresoController.crearLineaEgreso);
routerPresupuesto.delete("/eliminarLineaEgreso",egresoController.eliminarLineaEgreso);    


//Estimacion de costos
routerPresupuesto.post("/insertarEstimacionCosto",estimacionCostoController.crear);
routerPresupuesto.post("/insertarLineaEstimacionCosto",estimacionCostoController.crearLineaEstimacionCosto);
routerPresupuesto.delete("/eliminarLineaCosto",estimacionCostoController.eliminarLineaEstimacionCosto);

module.exports.routerPresupuesto = routerPresupuesto;
