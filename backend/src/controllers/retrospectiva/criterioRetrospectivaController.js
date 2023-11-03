const connection = require("../../config/db");

async function funclistarTodos(){
    try {
        const query = `CALL LISTAR_CRITERIOS_RETROSPECTIVA_TODOS();`;
        const [results] = await connection.query(query);
        criteriosRetrospectiva = results[0];
        return criteriosRetrospectiva;
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    funclistarTodos
}
