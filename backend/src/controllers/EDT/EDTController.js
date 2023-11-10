const connection = require("../../config/db");

async function eliminar(req,res,next) {
    const { idEDT } = req.params;
    console.log(`Procediendo: Eliminar/EDT ${idEDT}...`);
    try {
        const result = await funcEliminar(idEDT);
        res.status(200).json({
            message: "EDT eliminado"});
        console.log(`EDT ${idEDT} eliminado.`);
    } catch (error) {
        next(error);
    }
}

async function funcEliminar(idEDT) {
    try {
        const query = `CALL ELIMINAR_EDT_X_ID_EDT(?);`;
        [results] = await connection.query(query,[idEDT]);
    } catch (error) {
        console.log("ERROR en Eliminar/EDT", error);
        return 0;
    }
    return 1;
}

module.exports = {
    eliminar
}