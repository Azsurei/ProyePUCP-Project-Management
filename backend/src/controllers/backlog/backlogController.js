const connection = require("../../config/db");

async function listarXIdProyecto(req,res,next){
    const { idProyecto} = req.params;
   
    console.log(`Llegue a recibir solicitud listar backlog con id de Proyecto :  ${idProyecto}`);

    const query = `CALL LISTAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);`;
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
}

async function eliminar(idProductBacklog){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/ProductBacklog ${idProductBacklog}...`);
    try {
        const result = await funcEliminar(idProductBacklog);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`ProductBacklog ${idProductBacklog} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ProductBacklog", error);
    }
}

async function funcEliminar(idProductBacklog) {
    try {
        const query = `CALL ELIMINAR_PRODUCT_BACKLOG_X_ID_PRODUCT_BACKLOG(?);`;
        [results] = await connection.query(query,[idProductBacklog]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ProductBacklog", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/ProductBacklog del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`ProductBacklog del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ProductBacklog X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_PRODUCT_BACKLOG_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ProductBacklog X Proyecto", error);
        return 0;
    }
    return 1;
}

module.exports = {
    listarXIdProyecto,
    eliminar,
    eliminarXProyecto
}