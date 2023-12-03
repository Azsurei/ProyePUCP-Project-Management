const connection = require("../../config/db");

async function funcCrear(idComponenteEDT, data){
    try {
        const query = `CALL INSERTAR_ENTREGABLE(?,?);`;
        const [results] = await connection.query(query,[idComponenteEDT,data]);
        const idEntregable = results[0][0].idEntregable;
        console.log("ID del Entregable: ", idEntregable);
    } catch (error) {
        console.log(error);
    }
    //return idEntregable;
}

//Eliminar Entregables
async function eliminarEntregables(req,res,next){
    const {entregablesEliminar} = req.body;
    const query = `CALL ELIMINAR_ENTREGABLES_COMPONENTES(?);`;
    try {
        // Iteracion Eliminar Entregables
        for(const entregableEliminar of entregablesEliminar){
            await connection.query(query,[entregableEliminar.idEntregable]);
        }
        res.status(200).json({
            message: "Se ha eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error en la eliminación:", error);
        res.status(500).send("Error en la eliminación: " + error.message);
    }
}

//Insertar Entregables
async function insertarEntregables(req,res,next){
    const {entregablesInsertar, idComponente} = req.body;
    const query = `CALL INSERTAR_ENTREGABLES_COMPONENTES(?,?);`;
    try {
        // Iteracion Insertar Entregables
        for(const entregableInsertar of entregablesInsertar){
            await connection.query(query,[entregableInsertar.nombre, idComponente]);
        }    
        res.status(200).json({
            message: "Se ha insertado exitosamente"
        });
    } catch (error) {
        console.error("Error en la inserción:", error);
        res.status(500).send("Error en la inserción: " + error.message);
    }
}

//Modificar ComponentesEDT
async function modificarEntregables(req,res,next){
    const {entregablesModificar} = req.body;
    const query = `CALL MODIFICAR_ENTREGABLES_COMPONENTES(?,?);`;
    try {
        // Iteracion Modificar Entregables
        for(const entregableModificar of entregablesModificar){
            await connection.query(query,[entregableModificar.idEntregable, entregableModificar.nombre]);
        }    
        res.status(200).json({
            message: "Se ha modificado exitosamente"
        });
    } catch (error) {
        console.error("Error en la modificación:", error);
        res.status(500).send("Error en la modificación: " + error.message);
    }
}

module.exports = {
    funcCrear,
    insertarEntregables,
    modificarEntregables,
    eliminarEntregables
}