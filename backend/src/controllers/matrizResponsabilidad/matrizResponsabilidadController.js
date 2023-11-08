const connection = require("../../config/db");

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


async function actualizarEntregablesXProyecto(req, res, next) {
    const { celdasAModificar } = req.body;
    const query = `CALL ACTUALIZAR_ENTREGABLE_X_RESPONSABILIDAD_x_ROL(?,?,?,?);`;
    try {
        for(let celdaAModificar of celdasAModificar){
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
    listarResponsabilidad,
    listarRol,
    listarEntregables,
    insertarEntregableXResponsabilidadXRol,
    actualizarEntregablesXProyecto,
    listarEntregablesXProyecto
};
