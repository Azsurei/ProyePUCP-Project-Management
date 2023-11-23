const connection = require("../../config/db");

//Lógica
//Varios auto evaluaciones en un solo proyecto (Diferentes iteraciones)
//Pero uno solo va a estar activo
//

async function crearAutoEvaluacionTest(req,res,next){
    const {idProyecto, criterios} = req.body;
    const query = `CALL LISTAR_MIEMBRO_X_IDPROYECTO(?);`;
    try {
        const results = await connection.query(query,[idProyecto]);
        const usuariosXProyecto = results[0][0];
        for(const usuarioEvualador of usuariosXProyecto){
            for(const usuarioEvaluado of usuariosXProyecto){
                const query1 = `CALL INSERTAR_USUARIO_EVALUACION(?,?,?);`;
                const results1 = await connection.query(query1,[idProyecto,usuarioEvualador.idUsuario,usuarioEvaluado.idUsuario]);
                const idUsuarioEvaluacion = results1[0][0][0].idUsuarioEvaluacion;
                const query2 = `CALL INSERTAR_UN_CRITERIO_AUTOEVALUACION(?,?);`;
                for(const criterio of criterios){
                    const results2 = await connection.query(query2,[idUsuarioEvaluacion,criterio.nombre]);
                }
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
    const querydatos = `CALL LISTAR_AUTOEVALUACION_DATOS(?);`;
    const query = `CALL LISTAR_AUTOEVALUACION_X_USUARIO(?,?);`;
    try {
        const datos = await connection.query(querydatos,[idProyecto]);
        autoEvaluacion = datos[0][0];
        const results = await connection.query(query,[idProyecto,idUsuario]);
        const evaluados = results[0][0];
        for(const usuarioEvaluado of evaluados){
                const query1 = `CALL LISTAR_CRITERIO_AUTOEVALUACION(?);`;
                const criterios = await connection.query(query1,[usuarioEvaluado.idUsuarioEvaluacion]);
                usuarioEvaluado.criterios = criterios[0][0];
        }
        if(evaluados.length === 0){
            res.status(204).json({
                message: "Autoevaluacion no creada"
            });
        }
        else{
            res.status(200).json({
                autoEvaluacion,
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

async function crearAutoEvaluacion(req,res,next){
    const {idProyecto,nombre, criterio1, criterio2, criterio3, criterio4, fechaInicio, fechaFin} = req.body;
    try {
        //Creamos una AutoEvaluacion en la tabla AutoEvaluacionXProyecto 
        const query = `CALL INSERTAR_AUTOEVALUACION_X_IDPROYECTO(?,?,?,?);`;
        const results = await connection.query(query,[idProyecto,nombre,fechaInicio,fechaFin]);
        const idAutoEvaluacionXProyecto = results[0][0][0].idAutoEvaluacionXProyecto;
        console.log(idAutoEvaluacionXProyecto);
        //Obtenemos los miembros del proyecto
        const query1 = `CALL LISTAR_MIEMBRO_X_IDPROYECTO(?);`;
        const results1 = await connection.query(query1,[idProyecto]);
        const usuariosXProyecto = results1[0][0];
        //Creamos los criterios para cada miembro
        for(const usuarioEvualador of usuariosXProyecto){
            for(const usuarioEvaluado of usuariosXProyecto){
                const query2 = `CALL INSERTAR_USUARIO_EVALUACION(?,?,?);`;
                const results2 = await connection.query(query2,[idAutoEvaluacionXProyecto,usuarioEvualador.idUsuario,usuarioEvaluado.idUsuario]);
                const idUsuarioEvaluacion = results2[0][0][0].idUsuarioEvaluacion;
                const query3 = `CALL INSERTAR_CRITERIO_AUTOEVALUACION(?,?,?,?,?);`;
                const results3 = await connection.query(query3,[idUsuarioEvaluacion,criterio1,criterio2,criterio3,criterio4]);
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

async function listarTodasAutoEvaluacion(req,res,next){
    const {idProyecto} = req.params;
    const query = `CALL LISTAR_TODAS_AUTOEVALUACIONES_X_IDPROYECTO(?);`;
    try {
        const results = await connection.query(query,[idProyecto]);
        const autoEvaluaciones = results[0][0];
        const query1 = `CALL LISTAR_CRITERIOS_X_IDAUTOEVALUACION(?);`;
        for(const autoEvaluacion of autoEvaluaciones){
            let results1 = await connection.query(query1,[autoEvaluacion.idAutoEvaluacionXProyecto]);
            let criterio = await results1[0][0];
            autoEvaluacion.criterios = criterio;
        }
        res.status(200).json({
            autoEvaluaciones,
            message: "Autoevaluaciones listada"
        });
        console.log('Se listó las autoevalauciones correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function activarAutoEvaluacion(req,res,next){
    const {idProyecto, idAutoEvaluacionXProyecto} = req.body;
    try {
        const query = `CALL ACTIVAR_AUTOEVALUACION_X_ID(?,?);`;
        await connection.query(query,[idProyecto,idAutoEvaluacionXProyecto]);
        res.status(200).json({
            message: "Autoevaluacion activada"
        });
        console.log('Se activo la autoevalaucion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function finalizarAutoEvaluacion(req,res,next){
    const {idAutoEvaluacionXProyecto} = req.body;
    try {
        const query = `CALL FINALIZAR_AUTOEVALUACION_X_ID(?);`;
        await connection.query(query,[idAutoEvaluacionXProyecto]);
        res.status(200).json({
            message: "Autoevaluacion finalizada"
        });
        console.log('Se finalizo la autoevaluacion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function eliminar(idAutoevaluacion){
    //const { idAutoevaluacion } = req.body;
    console.log(`Procediendo: Eliminar/Autoevaluacion ${idAutoevaluacion}...`);
    try {
        const result = await funcEliminar(idAutoevaluacion);
        // res.status(200).json({
        //     idAutoevaluacion,
        //     message: "Autoevaluacion eliminado"});
        // console.log(`Autoevaluacion ${idAutoevaluacion} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Autoevaluacion", error);
    }
}

async function funcEliminar(idAutoevaluacion) {
    try {
        const query = `CALL ELIMINAR_AUTOEVALUACION_X_ID_AUTOEVALUACION(?);`;
        [results] = await connection.query(query,[idAutoevaluacion]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Autoevaluacion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/Autoevaluacion del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`Autoevaluacion del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/Autoevaluacion X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_AUTOEVALUACION_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/Autoevaluacion X Proyecto", error);
        return 0;
    }
    return 1;
}

async function listarAutoEvaluacionNotas(req,res,next){
    const {idAutoEvaluacionXProyecto} = req.params;
    //Primero obtenemos los miembros que tienen autoevaluacion
    const query = `CALL LISTAR_AUTOEVALUACION_MIEMBROS(?);`;
    const query1 = `CALL LISTAR_AUTOEVALUACION_NOTAS(?,?);`;
    const query2 = `CALL LISTAR_AUTOEVALUACION_OBSERVACIONES(?,?);`;
    try {
        const results = await connection.query(query,[idAutoEvaluacionXProyecto]);
        const miembros = results[0][0];
        //Sacamos las notas
        for(let miembro of miembros){
            console.log(miembro.idUsuarioEvaluado);
            const results1 = await connection.query(query1,[idAutoEvaluacionXProyecto,miembro.idUsuarioEvaluado]);
            let notas = results1[0][0];
            miembro.notas = notas;
        }
        //Sacamos las observaciones
        for(let miembro of miembros){
            const results2 = await connection.query(query2,[idAutoEvaluacionXProyecto,miembro.idUsuarioEvaluado]);
            let observaciones = results2[0][0];
            miembro.observaciones = observaciones;
        }
        res.status(200).json({
            miembros,
            message: "Autoevaluacion "
        });
        console.log('Se finalizo la autoevaluacion correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    crearAutoEvaluacionTest,
    listarAutoEvaluacion,
    actualizarAutoEvaluacion,
    crearAutoEvaluacion,
    listarTodasAutoEvaluacion,
    activarAutoEvaluacion,
    finalizarAutoEvaluacion,
    eliminar,
    eliminarXProyecto,
    listarAutoEvaluacionNotas
};
