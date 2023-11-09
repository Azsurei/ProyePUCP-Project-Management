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

async function actualizarTipoCambio(EUR2PEN,USD2PEN){
    try {
        const query = `CALL ACTUALIZAR_TIPO_CAMBIO(?);`;
        await connection.query(query,[USD2PEN]);
        console.log("Tipo de cambio actualizado de dolar a sol con: "+USD2PEN);
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    listarTodas,
    actualizarTipoCambio
}