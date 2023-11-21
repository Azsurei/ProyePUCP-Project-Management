const connection = require("../config/db");

async function listarCamposAdicionales(req, res, next) {
    console.log("Llegue a recibir solicitud listar Herramientas");
    const query = `CALL LISTAR_HERRAMIENTAS;`;
    try {
        const [results] = await connection.query(query);
        res.status(200).json({
            herramientas: results[0],
            message: "Herramientas obtenidas exitosamente",
        });
        console.log("Si se listarion las herramientas");
    } catch (error) {
        console.error("Error al obtener las herramientas:", error);
        res.status(500).send(
            "Error al obtener las herramientas: " + error.message
        );
    }
}





module.exports = {
    listarCamposAdicionales
};
