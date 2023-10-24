const express = require("express");
const routerActaReunion = express.Router();
const { verifyToken } = require("../middleware/middlewares");
const actaReunionController = require("../controllers/actaReunion/actaReunionController");
const temaReunionController = require("../controllers/actaReunion/temaReunionController");
const acuerdoController = require("../controllers/actaReunion/acuerdoController");
const comentarioReunionController = require("../controllers/actaReunion/comentarioReunionController");
const lineaActaReunionController = require("../controllers/actaReunion/lineaActaReunionController");
const participantesXReunionController = require("../controllers/actaReunion/participanteXReunionController");
const responsableAcuerdoController = require("../controllers/actaReunion/responsableAcuerdoController");

routerActaReunion.post("/crearActaReunion", actaReunionController.crear);
routerActaReunion.get("/listarActaReunionXIdProyecto/:idProyecto", actaReunionController.listarXIdProyecto);

// Linea Acta Reunion
routerActaReunion.post("/crearLineaActaReunion", lineaActaReunionController.crear);
routerActaReunion.get("/listarLineaActaReunionXIdActaReunion/:idActaReunion", lineaActaReunionController.listarXIdActaReunion);
routerActaReunion.get("/listarLineaActaReunionXIdLineaActaReunion/:idLineaActaReunion", lineaActaReunionController.listarXIdLineaActaReunion);

// Comentario reunion
routerActaReunion.post("/crearComentarioReunion", comentarioReunionController.crear);
routerActaReunion.get("/listarComentarioReunionXIdLineaActaReunion/:idLineaActaReunion", comentarioReunionController.listarXIdLineaActaReunion);

// Participante reunion
routerActaReunion.post("/crearParticipanteXReunion", participantesXReunionController.crear);
routerActaReunion.get("/listarParticipanteXReunionXIdActaReunion/:idActaReunion", participantesXReunionController.listarXIdLineaActaReunion);

// Tema reunion 
routerActaReunion.post("/crearTemaReunion", temaReunionController.crear);
routerActaReunion.get("/listarTemaReunionXIdLineaActaReunion/:idLineaActaReunion", temaReunionController.listarXIdLineaActaReunion);


// Acuerdo
routerActaReunion.post("/crearAcuerdo", actaReunionController.crear);
routerActaReunion.get("/listarAcuerdoXIdTemaReunion/:idTemaReunion", acuerdoController.listarXIdTemaReunion);

// Responsable acuerdo
routerActaReunion.post("/crearResponsableAcuerdo", responsableAcuerdoController.crear);
routerActaReunion.get("/listarResponsableAcuerdoXIdAcuerdo/:idAcuerdo", responsableAcuerdoController.listarXIdAcuerdo);

module.exports.routerActaReunion = routerActaReunion;
