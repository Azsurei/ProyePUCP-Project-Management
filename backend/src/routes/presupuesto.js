const express = require("express");
const routerPresupuesto = express.Router();
const { verifyToken } = require("../middleware/middlewares");

const monedaController = require("../controllers/presupuesto/monedaController");
const tipoIngresoController = require("../controllers/presupuesto/tipoIngresoController");
const tipoTransaccionController = require("../controllers/presupuesto/tipoTransaccionController");
const presupuestoController = require("../controllers/presupuesto/presupuestoController");
const ingresoController = require("../controllers/presupuesto/ingresoController");
const egresoController = require("../controllers/presupuesto/egresoController");
const estimacionCostoController = require("../controllers/presupuesto/estimacionCostoController");

//Presupuesto
routerPresupuesto.post("/insertarPresupuesto",verifyToken, presupuestoController.crear);
routerPresupuesto.get("/listarPresupuesto/:idPresupuesto",verifyToken, presupuestoController.listarXIdPresupuesto);
routerPresupuesto.get("/listarLineasTodasXIdPresupuesto/:idPresupuesto",verifyToken, presupuestoController.listarLineasTodas);
routerPresupuesto.put("/modificarPresupuesto",verifyToken, presupuestoController.modificar);
routerPresupuesto.put("/modificarPorcentasjesPresupuestoXIdPresupuesto",verifyToken, presupuestoController.modificarPorcentajes);
routerPresupuesto.get("/obtenerPresupuesto/:idPresupuesto",verifyToken, presupuestoController.obtenerPresupuesto);
routerPresupuesto.delete("/eliminarPresupuesto", verifyToken, presupuestoController.eliminar);
routerPresupuesto.delete("/eliminarPresupuestoXProyecto", verifyToken, presupuestoController.eliminarXProyecto);
//Listado monedas y tipos de transaccion e ingresos
routerPresupuesto.get("/listarMonedasTodas",verifyToken, monedaController.listarTodas);
routerPresupuesto.get("/listarTipoIngresosTodos",verifyToken, tipoIngresoController.listarTodos);    
routerPresupuesto.get("/listarTipoTransaccionTodos",verifyToken, tipoTransaccionController.listarTodos); 

// Ingresos
routerPresupuesto.post("/insertarIngreso",verifyToken, ingresoController.crear);
routerPresupuesto.post("/insertarLineaIngreso",verifyToken, ingresoController.crearLineaIngreso);
routerPresupuesto.get("/listarLineasIngresoXIdPresupuesto/:idPresupuesto",verifyToken, ingresoController.listarLineasXIdPresupuesto);
routerPresupuesto.put("/modificarLineaIngreso",verifyToken, ingresoController.modificarLineaIngreso);
//routerPresupuesto.get("/listarLineaXIdProyecto/:idProyecto",ingresoController.listarLineaXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaIngresoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin", verifyToken, ingresoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaIngreso",verifyToken, ingresoController.eliminarLineaIngreso);

// Egreso e ingreso
routerPresupuesto.get("/listarLineasIngresoYEgresoXIdPresupuesto/:idPresupuesto",verifyToken, presupuestoController.listarLineasIngresoYEgresoXIdPresupuesto);

// Egresos
routerPresupuesto.post("/insertarEgreso",verifyToken, egresoController.crear);
routerPresupuesto.post("/insertarLineaEgreso",verifyToken, egresoController.crearLineaEgreso);
routerPresupuesto.get("/listarLineasEgresoXIdPresupuesto/:idPresupuesto",verifyToken, egresoController.listarLineasXIdPresupuesto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineasEgresoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin",verifyToken, egresoController.listarLineasXNombreFechas);
routerPresupuesto.put("/modificarLineaEgreso",verifyToken, egresoController.modificarLineaEgreso);
routerPresupuesto.delete("/eliminarLineaEgreso",verifyToken, egresoController.eliminarLineaEgreso);    


//Estimacion de costos
routerPresupuesto.post("/insertarEstimacionCosto",verifyToken, estimacionCostoController.crear);
routerPresupuesto.post("/insertarLineaEstimacionCosto",verifyToken, estimacionCostoController.crearLineaEstimacionCosto);
routerPresupuesto.get("/listarLineasEstimacionCostoXIdPresupuesto/:idPresupuesto",verifyToken, estimacionCostoController.listarLineasXIdPresupuesto);
routerPresupuesto.put("/modificarLineaEstimacionCosto", verifyToken, estimacionCostoController.modificarLineaEstimacionCosto);
//routerPresupuesto.get("/listarEstimacionXIdProyecto/:idProyecto",estimacionCostoController.listarEstimacionXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaEstimacionCostoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin",verifyToken, estimacionCostoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaCosto",verifyToken, estimacionCostoController.eliminarLineaEstimacionCosto);

module.exports.routerPresupuesto = routerPresupuesto;
