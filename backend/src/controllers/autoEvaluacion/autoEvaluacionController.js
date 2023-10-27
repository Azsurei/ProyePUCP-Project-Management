const connection = require("../../config/db");

//Lógica
//Varios auto evaluaciones en un solo proyecto (Diferentes iteraciones)
//Pero uno solo va a estar activo
//

async function crearAutoEvaluacion(req,res,next){
    const {idProyecto, criterio1, criterio2, criterio3, criterio4} = req.body;
    const query = `CALL LISTAR_MIEMBRO_X_IDPROYECTO(?);`;
    try {
        const results = await connection.query(query,[idProyecto]);
        const usuariosXProyecto = results[0][0];
        for(const usuarioEvualador of usuariosXProyecto){
            for(const usuarioEvaluado of usuariosXProyecto){
                const query1 = `CALL INSERTAR_USUARIO_EVALUACION(?,?,?);`;
                const results1 = await connection.query(query1,[idProyecto,usuarioEvualador.idUsuario,usuarioEvaluado.idUsuario]);
                const idUsuarioEvaluacion = results1[0][0][0].idUsuarioEvaluacion;
                const query2 = `CALL INSERTAR_CRITERIO_AUTOEVALUACION(?,?,?,?,?);`;
                const results2 = await connection.query(query2,[idUsuarioEvaluacion,criterio1,criterio2,criterio3,criterio4]);
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
    const query = `CALL LISTAR_AUTOEVALUACION_X_USUARIO(?,?);`;
    try {
        const results = await connection.query(query,[idProyecto,idUsuario]);
        const evaluados = results[0][0];
        for(const usuarioEvaluado of evaluados){
                const query1 = `CALL LISTAR_CRITERIO_AUTOEVALUACION(?);`;
                const criterios = await connection.query(query1,[usuarioEvaluado.idUsuarioEvaluacion]);
                usuarioEvaluado.criterios = criterios[0][0];
        }
        if(evaluados.length === 0){
            const query2 = `CALL OBTENER_idRol_X_idUsuario(?,?);`;
            const results3 = await connection.query(query2,[idProyecto,idUsuario]);
            if(results3[0][0].length === 0){
                res.status(204).json({
                    message: "Autoevaluacion no creada"
                });
            }
            else{
                res.status(205).json({
                    message: "Solo miembro tiene autoevalaucion"
                });
            }
        }
        else{
            res.status(200).json({
                evaluados,
                message: "Autoevaluacion listada"
            });
        }
        console.log('Se listó la autoevalaucion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function actualizarAutoEvaluacion(req,res,next){
    const {evaluados} = req.body;
    console.log(evaluados);
    const query = `CALL ACTUALIZAR_OBSERVACION_X_ID(?,?);`;
    const query1 = `CALL ACTUALIZAR_NOTACRITERIO_X_ID(?,?,?);`;
    try {
        for(const evaluado of evaluados){
            await connection.query(query,[evaluado.idUsuarioEvaluacion, evaluado.observaciones]);
            for(const criterio of evaluado.criterios){
                await connection.query(query1,[criterio.idCriterioEvaluacion, criterio.criterio, criterio. nota]);
            }
        }
        res.status(200).json({
            message: "Autoevaluacion actualizada"
        });
        console.log('Se actualizo la autoevalaucion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    crearAutoEvaluacion,
    listarAutoEvaluacion,
    actualizarAutoEvaluacion
};
