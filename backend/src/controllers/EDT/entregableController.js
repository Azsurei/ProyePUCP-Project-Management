const connection = require("../../config/db");

async function funcCrear(idComponenteEDT, data){
    try {
        const query = `CALL INSERTAR_ENTREGABLE(?,?);`;
        const [results] = await connection.query(query,[idComponenteEDT,data]);
        const idEntregable = results[0][0].idEntregable;
        console.log("ID del Entregable: ", idEntregable);
    } catch (error) {
        next(error);
    }
    //return idEntregable;
}

module.exports = {
    funcCrear
}