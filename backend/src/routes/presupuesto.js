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
routerPresupuesto.post("/insertarPresupuesto",presupuestoController.crear);
routerPresupuesto.get("/listarPresupuesto/:idPresupuesto",presupuestoController.listarXIdPresupuesto);
routerPresupuesto.get("/listarLineasTodasXIdPresupuesto/:idPresupuesto",presupuestoController.listarLineasTodas);
routerPresupuesto.put("/modificarPresupuesto",presupuestoController.modificar);
routerPresupuesto.get("/obtenerPresupuesto/:idPresupuesto",presupuestoController.obtenerPresupuesto);
routerPresupuesto.delete("/eliminarPresupuesto", presupuestoController.eliminar);
routerPresupuesto.delete("/eliminarPresupuestoXProyecto", presupuestoController.eliminarXProyecto);
//Listado monedas y tipos de transaccion e ingresos
routerPresupuesto.get("/listarMonedasTodas",verifyToken, monedaController.listarTodas);
routerPresupuesto.get("/listarTipoIngresosTodos",verifyToken, tipoIngresoController.listarTodos);    
routerPresupuesto.get("/listarTipoTransaccionTodos",verifyToken, tipoTransaccionController.listarTodos); 

// Ingresos
routerPresupuesto.post("/insertarIngreso",ingresoController.crear);
routerPresupuesto.post("/insertarLineaIngreso",ingresoController.crearLineaIngreso);
routerPresupuesto.get("/listarLineasIngresoXIdPresupuesto/:idPresupuesto",ingresoController.listarLineasXIdPresupuesto);
routerPresupuesto.put("/modificarLineaIngreso",ingresoController.modificarLineaIngreso);
//routerPresupuesto.get("/listarLineaXIdProyecto/:idProyecto",ingresoController.listarLineaXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaIngresoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin",ingresoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaIngreso",ingresoController.eliminarLineaIngreso);

// Egreso e ingreso
routerPresupuesto.get("/listarLineasIngresoYEgresoXIdPresupuesto/:idPresupuesto",presupuestoController.listarLineasIngresoYEgresoXIdPresupuesto);

// Egresos
routerPresupuesto.post("/insertarEgreso",egresoController.crear);
routerPresupuesto.post("/insertarLineaEgreso",egresoController.crearLineaEgreso);
routerPresupuesto.get("/listarLineasEgresoXIdPresupuesto/:idPresupuesto",egresoController.listarLineasXIdPresupuesto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineasEgresoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin",egresoController.listarLineasXNombreFechas);
routerPresupuesto.put("/modificarLineaEgreso",egresoController.modificarLineaEgreso);
routerPresupuesto.delete("/eliminarLineaEgreso",egresoController.eliminarLineaEgreso);    


//Estimacion de costos
routerPresupuesto.post("/insertarEstimacionCosto",estimacionCostoController.crear);
routerPresupuesto.post("/insertarLineaEstimacionCosto",estimacionCostoController.crearLineaEstimacionCosto);
routerPresupuesto.get("/listarLineasEstimacionCostoXIdPresupuesto/:idPresupuesto",estimacionCostoController.listarLineasXIdPresupuesto);
routerPresupuesto.put("/modificarLineaEstimacionCosto",estimacionCostoController.modificarLineaEstimacionCosto);
//routerPresupuesto.get("/listarEstimacionXIdProyecto/:idProyecto",estimacionCostoController.listarEstimacionXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaEstimacionCostoXNombreFechas/:idPresupuesto/:descripcion/:fechaIni/:fechaFin",estimacionCostoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaCosto",estimacionCostoController.eliminarLineaEstimacionCosto);

module.exports.routerPresupuesto = routerPresupuesto;
