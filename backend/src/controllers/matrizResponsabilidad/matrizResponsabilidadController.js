const connection = require("../../config/db");

async function eliminar(idMatrizResponsabilidad){
    //const { idMatrizResponsabilidad } = req.body;
    console.log(`Procediendo: Eliminar/MatrizResponsabilidades ${idMatrizResponsabilidad}...`);
    try {
        const result = await funcEliminar(idMatrizResponsabilidad);
        // res.status(200).json({
        //     idMatrizResponsabilidad,
        //     message: "MatrizResponsabilidades eliminado"});
        console.log(`MatrizResponsabilidades ${idMatrizResponsabilidad} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/MatrizResponsabilidades", error);
    }
}

async function funcEliminar(idMatrizResponsabilidad) {
    try {
        const query = `CALL ELIMINAR_MATRIZ_RESPONSABILIDADES_X_ID_MATRIZ_R(?);`;
        [results] = await connection.query(query,[idMatrizResponsabilidad]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/MatrizResponsabilidades", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/MatrizResponsabilidades del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`MatrizResponsabilidades del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/MatrizResponsabilidades X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_MATRIZ_RESPONSABILIDADES_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/MatrizResponsabilidades X Proyecto", error);
        return 0;
    }
    return 1;
}

async function eliminarEntregableXResponsabilidadRol(req,res,next){
    const{idProyecto} = req.body;
    const query = `CALL ELIMINAR_ENTREGABLE_X_RESPONSABILIDADROL_X_ID(?);`;
    try {
        await connection.query(query,[idProyecto]);
        res.status(200).json({message: "EntregableXResponsabilidadRol eliminado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function insertarResponsabilidad(req,res,next){
    const{idProyecto, letraRol, nombreRol, colorRol, descrpcionRol} = req.body;
    const query = `CALL INSERTAR_RESPONSABILIDADROL_X_IDPROYECTO(?,?,?,?,?);`;
    try {
        const [results] = await connection.query(query,[idProyecto, letraRol, nombreRol, colorRol, descrpcionRol]);
        const idResponsabilidadRol = results[0][0].idResponsabilidadRol;
        res.status(200).json({idResponsabilidadRol, message: "ResponsabilidadRol insertado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function modificarResponsabilidad(req,res,next){
    const {idResponsabilidadRol, letraRol, nombreRol, colorRol, descrpcionRol} = req.body;
    const query = `CALL MODIFICAR_RESPONSABILIDADROL_X_ID(?,?,?,?,?);`;
    try {
        const [results] = await connection.query(query,[idResponsabilidadRol, letraRol, nombreRol, colorRol, descrpcionRol]);
        res.status(200).json({message: `Se modificó la responsabilidad ${idResponsabilidadRol} exitosamente`});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarResponsabilidad(req,res,next){
    const{idProyecto} = req.params;
    const query = `CALL LISTAR_RESPONSABILIDADROL_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        const responsabilidadRol = results[0];
        res.status(200).json({responsabilidadRol, message: "ResponsabilidadesRol listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminarResponsabilidad(req,res,next){
    const{idResponsabilidadRol} = req.body;
    const query = `CALL ELIMINAR_RESPONSABILIDADROL_X_ID(?);`;
    try {
        await connection.query(query,[idResponsabilidadRol]);
        res.status(200).json({message: "ResponsabilidadeRol eliminado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function listarRol(req, res, next) {
    const { idProyecto } = req.params;
    const query = `CALL LISTAR_ROL_EQUIPO_MATRIZRESPONSABILIDAD(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        const roles = results[0];
        console.log(`Se listaron los roles ${roles}!`);
        res.status(200).json({
            roles,
            message: "Roles listados exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarEntregables(req, res, next) {
    const { idProyecto } = req.params;
    const query = `CALL LISTAR_ENTREGABLE_X_IDPROYECTO(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        const entregables = results[0];
        console.log(`Se listaron los entregables del proyecto ${idProyecto}!`);
        res.status(200).json({
            entregables,
            message: "Entregables listados exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function insertarEntregableXResponsabilidadXRol(req, res, next) {
    const { celdasInsertar } = req.body;
    const query = `CALL INSERTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(?,?,?);`;
    try {
        for(let celdaInsertar of celdasInsertar){
            const [results] = await connection.query(query, [celdaInsertar.idEntregable, celdaInsertar.idResponsabilidad, celdaInsertar.idRol]);
            const idEntregableXResponsabilidadXRol = results[0][0].idEntregableXResponsabilidadXRol;
        }
        res.status(200).json({
            message: "Se insertó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function listarEntregablesXProyecto(req, res, next) {
    const { idProyecto } = req.params;
    const query = `CALL LISTAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(?);`;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        const entregables = results[0];
        res.status(200).json({
            entregables,
            message: "Se insertó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}


async function actualizarEntregables(req, res, next) {
    const { modifiedExistingCells } = req.body;
    const query = `CALL ACTUALIZAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(?,?,?,?);`;
    console.log("Las celdas modificados son:",modifiedExistingCells);
    try {
        for(let celdaAModificar of modifiedExistingCells){
            const [results] = await connection.query(query, [celdaAModificar.idEntregableXResponsabilidadXRol, celdaAModificar.idEntregable,
                celdaAModificar.idResponsabilidad, celdaAModificar.idRol]);
        }
        res.status(200).json({
            message: "Se modificó exitosamente",
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
    eliminar,
    eliminarXProyecto,
    eliminarEntregableXResponsabilidadRol,
    insertarResponsabilidad,
    modificarResponsabilidad,
    eliminarResponsabilidad,
    listarResponsabilidad,
    listarRol,
    listarEntregables,
    insertarEntregableXResponsabilidadXRol,
    actualizarEntregables,
    listarEntregablesXProyecto
};
