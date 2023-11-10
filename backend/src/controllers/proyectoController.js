const connection = require("../config/db");

const backlogController = require('../controllers/backlog/backlogController');
const EDTController = require('../controllers/EDT/EDTController');
const actaConstitucionController = require("../controllers/actaConstitucion/actaConstitucionController");
const cronogramaController = require("../controllers/cronograma/cronogramaController");
const catalogoRiesgosController = require("../controllers/catalogoRiesgos/catalogoRiesgosController");
const catalogoInteresadosController = require("../controllers/catalogoInteresados/catalogoInteresadosController");
const matrizResponsabilidadController = require("../controllers/matrizResponsabilidad/matrizResponsabilidadController");
const matrizComunicacionesController = require("../controllers/matrizComunicaciones/matrizComunicacionesController");
const autoEvaluacionController = require("../controllers/autoEvaluacion/autoEvaluacionController");
const retrospectivaController = require("../controllers/retrospectiva/retrospectivaController");
const actaReunionController = require("../controllers/actaReunion/actaReunionController");
const equipoController = require('../controllers/equipo/equipoController');
const presupuestoController = require("../controllers/presupuesto/presupuestoController");


async function eliminar(req,res,next){
    const {idProyecto,herramientas} = req.params;
    try {
        await funcEliminar(idProyecto,herramientas);
        console.log(`Proyecto ${idProyecto} eliminado`);
    }catch (error) {
        next(error);
    }
}

async function funcEliminar(idProyecto,herramientas){
    try {
        const query = `CALL ELIMINAR_PROYECTO(?);`;
        await connection.query(query,[idProyecto]);

        // idHerramientaCreada es la herramienta relacionada al proyecto. 
        // idHerramienta es la herramienta en sí. NO SE ELIMINA
        for(const herramienta of herramientas){
            if(herramienta.idHerramienta==1){
                await backlogController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==2){
                await EDTController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==3){
                await actaConstitucionController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==4){
                await cronogramaController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==5){
                await catalogoRiesgosController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==6){
                await catalogoInteresadosController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==7){
                await matrizResponsabilidadController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==8){
                await matrizComunicacionesController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==9){
                await autoEvaluacionController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==10){
                await retrospectivaController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==11){
                await actaReunionController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==12){
                await equipoController.eliminar(herramienta.idHerramientaCreada);
            }
            if(herramienta.idHerramienta==13){
                await presupuestoController.eliminar(herramienta.idHerramientaCreada);
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    eliminar
}