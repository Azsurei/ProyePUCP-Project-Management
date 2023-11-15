const connection = require("../../config/db");

async function listarTodos(req,res,next){
    try {
        const query = `CALL LISTAR_TIPO_TRANSACCION_TODOS;`;
        const [results] = await connection.query(query);
        tiposTransaccion = results[0];

         res.status(200).json({
            tiposTransaccion,
            message: "Tipos transaccion listados correctamente"
         });
    } catch (error) {
        next(error);
    }
}

module.exports={
    listarTodos
}