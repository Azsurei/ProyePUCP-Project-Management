const connection = require("../config/db");

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

        for(const herramienta of herramientas){
            if(herramienta.idHerramienta==1){
                await productBacklogController.eliminar(herramienta.idHerramientaCreada);
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
                await matrizResponsabilidad.eliminar(herramienta.idHerramientaCreada);
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
                await equipoController.js(herramienta.idHerramientaCreada);
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