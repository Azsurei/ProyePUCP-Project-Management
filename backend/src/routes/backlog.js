const express = require('express');
const connection = require('../config/db');
const { verifyToken } = require('../middleware/middlewares');
const routerHistoriaDeUsuario = require('./historiaDeUsuario').routerHistoriaDeUsuario;
const sprintController = require('../controllers/backlog/sprintController');
const epicaController = require('../controllers/backlog/epicaController');
const routerBacklog = express.Router();

routerBacklog.use("/hu",routerHistoriaDeUsuario);

routerBacklog.get("/:idProyecto/listarBacklog",verifyToken,async(req,res)=>{
    const { idProyecto} = req.params;
   
    console.log(`Llegue a recibir solicitud listar backlog con id de Proyecto :  ${idProyecto}`);

    const query = `
        CALL LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({
            backlog: results[0],
            message: "Backlog obtenido exitosamente"
        });
        console.log(`Se han listado el backlog para el proyecto ${idProyecto}!`);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).send("Error al obtener los proyectos: " + error.message);
    }
})
// Listado de epicas por id de backlog
routerBacklog.get("/listarEpicasXIdBacklog/:idBacklog",epicaController.listarEpicasXIdBacklog);
routerBacklog.post("/insertarSprint",sprintController.crear);
routerBacklog.get("/listarSprintsXIdBacklog/:idBacklog",sprintController.listarSprintsXIdBacklog);
routerBacklog.put("/actualizarEstadoSprint",sprintController.modificarEstado);
routerBacklog.delete("/eliminarSprint",sprintController.eliminarSprint);

// Ver si es factible tener el id del proyecto en el URL, en el otro caso solo seria backlog/idEPica
routerBacklog.get("/:idEpica/listarHUs",verifyToken,async(req,res)=>{
    const {idEpica} = req.params;
    console.log("Llegue a recibir solicitud listar hu");
    const query = `
        CALL LISTAR_HISTORIAS_DE_USUARIO_X_ID_EPICA(?);
    `;
    try {
        const [results] = await connection.query(query,[idEpica]);
        res.status(200).json({
            HUs: results[0],
            message: "Historias de usuario obtenidas exitosamente"
        });
        console.log(`Se han listado las historias de usuario para la epica ${idEpica}!`);
    } catch (error) {
        console.error("Error al obtener las historias de usuario:", error);
        res.status(500).send("Error al obtener las historias de usuario: " + error.message);
    }
})

routerBacklog.get("/test/:testId", (req, res) => {
    res.send(req.params);
});

routerBacklog.get("/:idProyecto/listarHistorias", verifyToken, async (req, res) => {
    
    const { idProyecto } = req.params;
    console.log(`Llegué a recibir la solicitud para listar historias del proyecto ${idProyecto}`);
    const query = `
      CALL LISTAR_HISTORIAS_DE_USUARIO_X_ID_PROYECTO_TABLA(?);
    `;
    try {
      const [results] = await connection.query(query, [idProyecto]);
      console.log(results[0]);
      res.status(200).json({
        historias: results[0],
        message: "Historias obtenidas exitosamente"
      });
      console.log(`Se han listado las historias para el proyecto ${idProyecto}!`);
    } catch (error) {
      console.error("Error al obtener las historias:", error);
      res.status(500).send("Error al obtener las historias: " + error.message);
    }
  });


module.exports.routerBacklog = routerBacklog;