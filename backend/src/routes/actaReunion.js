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

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

routerActaReunion.post("/crearActaReunion", verifyToken, actaReunionController.crear);
routerActaReunion.get("/listarActaReunionXIdProyecto/:idProyecto", verifyToken, actaReunionController.listarXIdProyecto);
routerActaReunion.delete("/eliminarActaReunion",verifyToken,actaReunionController.eliminar);
routerActaReunion.delete("/eliminarActaReunionXProyecto",verifyToken,actaReunionController.eliminarXProyecto);

// Linea Acta Reunion
routerActaReunion.post("/crearLineaActaReunion",upload.single('file'),verifyToken,lineaActaReunionController.crear);
routerActaReunion.get("/listarLineaActaReunionXIdActaReunion/:idActaReunion",verifyToken,lineaActaReunionController.listarXIdActaReunion);
routerActaReunion.get("/listarLineaActaReunionXIdLineaActaReunion/:idLineaActaReunion", verifyToken,lineaActaReunionController.listarXIdLineaActaReunion);
routerActaReunion.put("/modificarLineaActaReunion",verifyToken,lineaActaReunionController.modificar);
routerActaReunion.delete("/eliminarLineaActaReunionXIdLineaActaReunion",verifyToken,lineaActaReunionController.eliminarXIdLineaActaReunion);

// Comentario reunion
routerActaReunion.post("/crearComentarioReunion",verifyToken,comentarioReunionController.crear);
routerActaReunion.get("/listarComentarioReunionXIdLineaActaReunion/:idLineaActaReunion",verifyToken,comentarioReunionController.listarXIdLineaActaReunion);

// Participante reunion
routerActaReunion.post("/crearParticipanteXReunion",verifyToken,participantesXReunionController.crear);
routerActaReunion.get("/listarParticipanteXReunionXIdActaReunion/:idActaReunion",verifyToken,participantesXReunionController.listarXIdLineaActaReunion);

// Tema reunion 
routerActaReunion.post("/crearTemaReunion",verifyToken,temaReunionController.crear);
routerActaReunion.get("/listarTemaReunionXIdLineaActaReunion/:idLineaActaReunion",verifyToken,temaReunionController.listarXIdLineaActaReunion);

// Acuerdo
routerActaReunion.post("/crearAcuerdo",verifyToken, acuerdoController.crear);
routerActaReunion.get("/listarAcuerdoXIdTemaReunion/:idTemaReunion",verifyToken, acuerdoController.listarXIdTemaReunion);

// Responsable acuerdo
routerActaReunion.post("/crearResponsableAcuerdo",verifyToken, responsableAcuerdoController.crear);
routerActaReunion.get("/listarResponsableAcuerdoXIdAcuerdo/:idAcuerdo",verifyToken, responsableAcuerdoController.listarXIdAcuerdo);

module.exports.routerActaReunion = routerActaReunion;
