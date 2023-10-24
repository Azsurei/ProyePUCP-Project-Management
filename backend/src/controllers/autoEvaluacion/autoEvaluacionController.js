const connection = require("../../config/db");

//Lógica
//Varios auto evaluaciones en un solo proyecto (Diferentes iteraciones)
//Pero uno solo va a estar activo
//

async function crearAutoEvaluacion(req,res,next){
    const {idProyecto} = req.body;
    const query = `CALL LISTAR_USUARIOS_X_IDPROYECTO(?);`;
    try {
        const results = await connection.query(query,[idProyecto]);
        const usuariosXProyecto = results[0][0];
        for(const usuarioEvualador of usuariosXProyecto){
            for(const usuarioEvaluado of usuariosXProyecto){
                const query1 = `CALL INSERTAR_USUARIO_EVALUACION(?,?,?);`;
                const results1 = await connection.query(query1,[idProyecto,usuarioEvualador.idUsuario,usuarioEvaluado.idUsuario]);
                const idUsuarioEvaluacion = results1[0][0][0].idUsuarioEvaluacion;
                console.log(idUsuarioEvaluacion);
                const query2 = `CALL INSERTAR_CRITERIO_AUTOEVALUACION(?);`;
                const results2 = await connection.query(query2,[idUsuarioEvaluacion]);
            }
        }
        res.status(200).json({
            message: "Autoevaluacion creada"
        });
        console.log('Se creo la autoevalaucion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function listarAutoEvaluacion(req,res,next){
    const {idProyecto, idUsuario} = req.params;
    console.log(idProyecto, idUsuario);
    const query = `CALL LISTAR_AUTOEVALUACION_X_USUARIO(?,?);`;
    try {
        const results = await connection.query(query,[idProyecto,idUsuario]);
        const evaluados = results[0][0];
        for(const usuarioEvaluado of evaluados){
                const query1 = `CALL LISTAR_CRITERIO_AUTOEVALUACION(?);`;
                const criterios = await connection.query(query1,[usuarioEvaluado.idUsuarioEvaluacion]);
                usuarioEvaluado.criterios = criterios[0][0];
        }
        res.status(200).json({
            evaluados,
            message: "Autoevaluacion listada"
        });
        console.log('Se listó la autoevalaucion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    crearAutoEvaluacion,
    listarAutoEvaluacion
};
