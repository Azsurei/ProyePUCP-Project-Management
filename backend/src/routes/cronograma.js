const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronograma/cronogramaController");
const tareaController = require("../controllers/cronograma/tareaController");
const sprintController = require("../controllers/backlog/sprintController");
//Cronograma
routerCronograma.post("/insertarCronograma",verifyToken, cronogramaController.crear);
routerCronograma.put("/actualizarCronograma",verifyToken, cronogramaController.actualizar);
routerCronograma.delete("/eliminarCronograma", cronogramaController.eliminar);
routerCronograma.delete("/eliminarCronogramaXProyecto", cronogramaController.eliminarXProyecto);
//routerCronograma.post("/insertarTarea", tareaController.crear);

routerCronograma.put("/actualizarTarea", verifyToken,tareaController.modificar);
routerCronograma.post("/listarCronograma", cronogramaController.listar);

//Sprint

//Tarea
routerCronograma.post("/insertarTarea", tareaController.crear); //modificado para soportar dependencias bien
//routerCronograma.put("/actualizarTarea", verifyToken,tareaController.modificar);    //! pendiente


routerCronograma.put("/actualizarIdSprintXTarea",tareaController.modificarIdSprintDeTareas);

routerCronograma.get("/listarTareasXidProyecto/:idProyecto", tareaController.listarXIdProyecto);    //!pendiente
routerCronograma.get("/listarEntregablesXidProyecto/:idProyecto", cronogramaController.listarEntregablesXidProyecto);

routerCronograma.post("/descargarExcelCronogramaTareas", cronogramaController.descargarExcel);

routerCronograma.delete("/eliminarTarea", tareaController.eliminarTarea);


//Registro Progreso Tarea
routerCronograma.post("/registrarProgresoTarea", tareaController.registrarProgreso);


//Listado con progresos asociados
routerCronograma.get("/listarTareasXidProyectoConProgresosDetallados/:idProyecto", tareaController.listarXIdProyectoConProgresos);


//Sobre permisos de edicion
routerCronograma.post("/verificarAccesoEdicion", tareaController.verificarAccesoEdicion);
routerCronograma.post("/salirEdicionTarea", tareaController.salirEdicionTarea);



module.exports.routerCronograma = routerCronograma;