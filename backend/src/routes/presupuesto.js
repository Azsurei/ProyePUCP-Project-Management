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
routerPresupuesto.get("/listarLineasTodasXIdProyecto/:idProyecto",presupuestoController.listarLineasTodas);
routerPresupuesto.get("/listarPresupuesto/:idPresupuesto",presupuestoController.listarXIdPresupuesto);
routerPresupuesto.put("/modificarPresupuesto",presupuestoController.modificar);

//Listado monedas y tipos de transaccion e ingresos
routerPresupuesto.get("/listarMonedasTodas",verifyToken, monedaController.listarTodas);
routerPresupuesto.get("/listarTipoIngresosTodos",verifyToken, tipoIngresoController.listarTodos);    
routerPresupuesto.get("/listarTipoTransaccionTodos",verifyToken, tipoTransaccionController.listarTodos); 

// Ingresos
routerPresupuesto.post("/insertarIngreso",ingresoController.crear);
routerPresupuesto.post("/insertarLineaIngreso",ingresoController.crearLineaIngreso);
routerPresupuesto.get("/listarLineasIngresoXIdProyecto/:idProyecto",ingresoController.listarLineasXIdProyecto);
//routerPresupuesto.get("/listarLineaXIdProyecto/:idProyecto",ingresoController.listarLineaXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaIngresoXNombreFechas/:idProyecto/:descripcion/:fechaIni/:fechaFin",ingresoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaIngreso",ingresoController.eliminarLineaIngreso);

// Egresos
routerPresupuesto.post("/insertarEgreso",egresoController.crear);
routerPresupuesto.post("/insertarLineaEgreso",egresoController.crearLineaEgreso);
routerPresupuesto.get("/listarLineasEgresoXIdProyecto/:idProyecto",egresoController.listarLineasXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaEgresoXNombreFechas/:idProyecto/:descripcion/:fechaIni/:fechaFin",egresoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaEgreso",egresoController.eliminarLineaEgreso);    


//Estimacion de costos
routerPresupuesto.post("/insertarEstimacionCosto",estimacionCostoController.crear);
routerPresupuesto.post("/insertarLineaEstimacionCosto",estimacionCostoController.crearLineaEstimacionCosto);
routerPresupuesto.get("/listarLineasEstimacionCostoXIdProyecto/:idProyecto",estimacionCostoController.listarLineasXIdProyecto);
//routerPresupuesto.get("/listarEstimacionXIdProyecto/:idProyecto",estimacionCostoController.listarEstimacionXIdProyecto); //Corregido (Augusto)
routerPresupuesto.get("/listarLineaEstimacionCostoXNombreFechas/:idProyecto/:descripcion/:fechaIni/:fechaFin",estimacionCostoController.listarLineasXNombreFechas);
routerPresupuesto.delete("/eliminarLineaCosto",estimacionCostoController.eliminarLineaEstimacionCosto);

module.exports.routerPresupuesto = routerPresupuesto;
