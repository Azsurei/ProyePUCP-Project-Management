const express = require("express");
const routerCronograma = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const cronogramaController = require("../controllers/cronograma/cronogramaController");
const tareaController = require("../controllers/cronograma/tareaController");
const sprintController = require("../controllers/backlog/sprintController");
//Cronograma
routerCronograma.post("/insertarCronograma",verifyToken, cronogramaController.crear);
routerCronograma.put("/actualizarCronograma",verifyToken, cronogramaController.actualizar);
routerCronograma.delete("/eliminarCronograma", verifyToken, cronogramaController.eliminar);
routerCronograma.delete("/eliminarCronogramaXProyecto", verifyToken, cronogramaController.eliminarXProyecto);
//routerCronograma.post("/insertarTarea", tareaController.crear);

routerCronograma.put("/actualizarTarea", verifyToken,tareaController.modificar);
routerCronograma.post("/listarCronograma", verifyToken, cronogramaController.listar);

//Sprint

//Tarea
routerCronograma.post("/insertarTarea",verifyToken, tareaController.crear); //modificado para soportar dependencias bien
//routerCronograma.put("/actualizarTarea", verifyToken,tareaController.modificar);    //! pendiente


routerCronograma.put("/actualizarIdSprintXTarea",verifyToken, tareaController.modificarIdSprintDeTareas);

routerCronograma.get("/listarTareasXidProyecto/:idProyecto",verifyToken, tareaController.listarXIdProyecto);    //!pendiente
routerCronograma.get("/listarEntregablesXidProyecto/:idProyecto",verifyToken, cronogramaController.listarEntregablesXidProyecto);

routerCronograma.post("/descargarExcelCronogramaTareas",verifyToken, cronogramaController.descargarExcel);

routerCronograma.delete("/eliminarTarea",verifyToken, tareaController.eliminarTarea);


//Registro Progreso Tarea
routerCronograma.post("/registrarProgresoTarea",verifyToken, tareaController.registrarProgreso);


//Listado con progresos asociados
routerCronograma.get("/listarTareasXidProyectoConProgresosDetallados/:idProyecto",verifyToken, tareaController.listarXIdProyectoConProgresos);


//Sobre permisos de edicion
routerCronograma.post("/verificarAccesoEdicion",verifyToken, tareaController.verificarAccesoEdicion);
routerCronograma.post("/salirEdicionTarea",verifyToken, tareaController.salirEdicionTarea);



module.exports.routerCronograma = routerCronograma;