const express = require('express');
const connection = require('../config/db');
const { verifyToken } = require('../middleware/middlewares');
const routerHistoriaDeUsuario = require('./historiaDeUsuario').routerHistoriaDeUsuario;
const sprintController = require('../controllers/backlog/sprintController');
const epicaController = require('../controllers/backlog/epicaController');
const backlogController = require('../controllers/backlog/backlogController');
const historiaDeUsuarioController = require('../controllers/backlog/historiaDeUsuarioController');
const routerBacklog = express.Router();

routerBacklog.use("/hu",routerHistoriaDeUsuario);

routerBacklog.get("/:idProyecto/listarBacklog",verifyToken,backlogController.listarXIdProyecto);
routerBacklog.delete("/eliminarProductBacklog",backlogController.eliminar);

//Epicas
routerBacklog.get("/listarEpicasXIdBacklog/:idBacklog",epicaController.listarEpicasXIdBacklog);

//Sprints
routerBacklog.post("/insertarSprint",sprintController.crear);
routerBacklog.get("/listarSprintsXIdBacklogcronograma/:idBacklog/:idCronograma",sprintController.listarSprintsXIdBacklogCronograma);
routerBacklog.put("/modificarSprint",sprintController.modificar);
routerBacklog.put("/actualizarEstadoSprint",sprintController.modificarEstado);
routerBacklog.delete("/eliminarSprint",sprintController.eliminarSprint);

// Ver si es factible tener el id del proyecto en el URL, en el otro caso solo seria backlog/idEPica
//Historia de usuario
routerBacklog.get("/listarHUs/:idEpica",historiaDeUsuarioController.listarXIdEpica);
routerBacklog.get("/listarHistorias/:idProyecto", verifyToken, historiaDeUsuarioController.listarXIdProyectoTabla);

routerBacklog.get("/test/:testId", (req, res) => {
    res.send(req.params);
});

module.exports.routerBacklog = routerBacklog;