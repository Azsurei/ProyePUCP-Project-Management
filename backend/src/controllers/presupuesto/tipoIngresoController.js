const connection = require("../../config/db");

async function listarTodos(req,res,next){
    try {
        const query = `CALL LISTAR_TIPO_INGRESO_TODOS;`;
        const [results] = await connection.query(query);
        tiposIngreso = results[0];

         res.status(200).json({
            tiposIngreso,
            message: "Tipos ingreso listados correctamente"
         });
    } catch (error) {
        next(error);
    }
}

async function funcListarTodos(){
    try {
        const query = `CALL LISTAR_TIPO_INGRESO_TODOS;`;
        const [results] = await connection.query(query);
        tiposIngreso = results[0];

        return tiposIngreso;
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    listarTodos,
    funcListarTodos
}