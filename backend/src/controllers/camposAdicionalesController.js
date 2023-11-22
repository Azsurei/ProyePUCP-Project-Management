const connection = require("../config/db");

async function listarCamposAdicionales(req, res, next) {
    const {idLineaAsociada, idHerramienta} = req.body
    const query = `CALL LISTAR_CAMPO_ADICIONAL_X_ID_LINEA_ID_HERRAMIENTA(?,?);`;
    try {
        const [results] = await connection.query(query,[idLineaAsociada,idHerramienta]);
        res.status(200).json({
            camposAdicionales: results[0],
            message: "Campos obtenidos exitosamente",
        });
        console.log("Si se listarion los campos");
    } catch (error) {
        console.error("Error al obtener los campos:", error);
        res.status(500).send(
            "Error al obtener los campos: " + error.message
        );
    }
}

async function registrarCamposAdicionales(req, res, next){
    const {listaCampos, idLineaAsociada, idHerramienta, tipoInput} = req.body
    try {
        const query = `CALL ELIMINAR_CAMPOS_ADICIONALES(?,?);`;
        const [results] = await connection.query(query,[idLineaAsociada,idHerramienta]);

        const query2 = "CALL INSERTAR_CAMPO_ADICIONAL(?,?,?,?,?);"
        for(const campo of listaCampos){
            const [result2] = await connection.query(query2,[idLineaAsociada,idHerramienta,tipoInput, campo.titulo, campo.descripcion]);
        }

        res.status(200).json({
            message: "Campos registrados exitosamente",
        });
        console.log("Si se registraron los campos");
    } catch (error) {
        console.error("Error al registrar los campos:", error);
        res.status(500).send(
            "Error al registrar los campos: " + error.message
        );
    }
}




module.exports = {
    listarCamposAdicionales,
    registrarCamposAdicionales
};
