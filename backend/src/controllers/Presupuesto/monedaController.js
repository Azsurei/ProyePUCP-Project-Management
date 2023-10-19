const connection = require("../../config/db");

async function listarTodas(req,res,next){
    try {
        const query = `CALL LISTAR_MONEDA_TODAS;`;
        const [results] = await connection.query(query);
        monedas = results[0];

         res.status(200).json({
            monedas,
            message: "Monedas listadas correctamente"
         });
    } catch (error) {
        next(error);
    }
}

module.exports={
    listarTodas
}