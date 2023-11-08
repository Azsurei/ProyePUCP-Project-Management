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
    const { idProyecto } = req.body;
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

module.exports = {
    listarResponsabilidad,
    listarRol,
    listarEntregables
};
