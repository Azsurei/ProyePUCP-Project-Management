const connection = require("../../config/db");

async function funcCrear(idComponenteEDT, data){
    try {
        const query = `CALL INSERTAR_CRITERIOS_ACEPTACION(?,?);`;
        const [results] = await connection.query(query,[idComponenteEDT,data]);
        const idComponenteCriterioDeAceptacion = results[0][0].idComponenteCriterioDeAceptacion;
        console.log("ID del Criterio de Aceptacion: ", idComponenteCriterioDeAceptacion);
    } catch (error) {
        next(error);
    }
    //return idComponenteCriterioDeAceptacion;
}

module.exports = {
    funcCrear
}