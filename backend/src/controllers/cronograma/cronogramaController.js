const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL INSERTAR_CRONOGRAMA(?);`;
        await connection.query(query,[idProyecto]);
        res.status(200).json({message: "Cronograma creado"});
    } catch (error) {
        next(error);
    }
}

async function actualizar(req,res,next){
    const {idProyecto,fechaInicio,fechaFin} = req.body;
    try {
        const query = `CALL ACTUALIZAR_CRONOGRAMA(?,?,?);`;
        await connection.query(query,[idProyecto,fechaInicio,fechaFin]);
        res.status(200).json({message: "Cronograma actualizado"});
    } catch (error) {
        next(error);
    }
}

async function listar(req,res,next){
    const {idProyecto} = req.body;
    try {
        const query = `CALL LISTAR_CRONOGRAMA_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({cronograma: results[0][0]});
    } catch (error) {
        next(error);
    }
}


async function listarEntregablesXidProyecto(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_ENTREGABLES_X_ID_PROYECTO(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        res.status(200).json({entregables: results[0]});
    } catch (error) {
        next(error);
    }
}

async function eliminar(idCronograma){
    //const { idCronograma } = req.body;
    console.log(`Procediendo: Eliminar/Cronograma ${idCronograma}...`);
    try {
        const result = await funcEliminar(idCronograma);
        // res.status(200).json({
        //     idCronograma,
        //     message: "Cronograma eliminado"});
        console.log(`Cronograma ${idCronograma} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Cronograma", error);
    }
}

async function funcEliminar(idCronograma) {
    try {
        const query = `CALL ELIMINAR_CRONOGRAMA_X_ID_CRONOGRAMA(?);`;
        [results] = await connection.query(query,[idCronograma]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Cronograma", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/Cronograma del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`Cronograma del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Cronograma X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_CRONOGRAMA_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Cronograma X Proyecto", error);
        return 0;
    }
    return 1;
}

module.exports = {
    crear,
    actualizar,
    eliminar,
    eliminarXProyecto,
    listar,
    listarEntregablesXidProyecto
};
