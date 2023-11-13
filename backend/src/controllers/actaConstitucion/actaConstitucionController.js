const connection = require("../../config/db");

//Todo va a ser idProyecto
async function listar(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query1 = `CALL LISTAR_ACTA_X_IDPROYECTO(?);`;
        const [acta] = await connection.query(query1,[idProyecto]);
        const query2 = `CALL LISTAR_DETALLEAC_X_IDPROYECTO(?);`;
        const [results] = await connection.query(query2,[idProyecto]);
        const detalleAC = {
            general: acta[0],
            actaData: results[0]
        };
        res.status(200).json({detalleAC, message: "DetalleAC listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function modificarCampos(req,res,next){
    const{idProyecto, nombreProyecto, empresa, cliente, patrocinador, gerente, actaData} = req.body;
    try {
        const query1 = `CALL MODIFICAR_ACTA_CONSTITUCION(?,?,?,?,?,?);`;
        const [acta] = await connection.query(query1,[idProyecto, nombreProyecto, 
            empresa, cliente, patrocinador, gerente]);
        for (const campo of actaData) {
            console.log(`Datos: ${campo.idDetalle},${campo.nombre},${campo.detalle}`);
            const [results] = await connection.query(`
            CALL MODIFICAR_CAMPO_DETALLEAC(
                ${campo.idDetalle},
                '${campo.nombre}',
                '${campo.detalle}'
            );
            `);
        }
        res.status(200).json({message: "DetalleAC modificado"});
    } catch (error) {
        next(error);
    }
}

async function crearCampos(req,res,next){
    const{idProyecto, nombreCampo, detalleCampo} = req.body;
    try {
        const query1 = `CALL CREAR_CAMPO_AC(?,?,?);`;
        const [results] = await connection.query(query1,[idProyecto, nombreCampo, detalleCampo]);
        campoCreado = results[0][0];
        res.status(200).json({campoCreado: campoCreado, message: "CampoAC Creado"});
    } catch (error) {
        next(error);
    }
}

async function eliminarCampo(req,res,next){
    const{idDetalle} = req.body;
    try {
        const query1 = `CALL ELIMINAR_CAMPO_AC(?);`;
        const [results] = await connection.query(query1,[idDetalle]);
        res.status(200).json({message: "CampoAC Eliminado"});
    } catch (error) {
        next(error);
    }
}

async function eliminar(idActaConstitucion){
    //const { idActaConstitucion } = req.body;
    console.log(`Procediendo: Eliminar/ActaConstitucion ${idActaConstitucion}...`);
    try {
        const result = await funcEliminar(idActaConstitucion);
        // res.status(200).json({
        //     idActaConstitucion,
        //     message: "ActaConstitucion eliminado"});
        console.log(`ActaConstitucion ${idActaConstitucion} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ActaConstitucion", error);
    }
}

async function funcEliminar(idActaConstitucion) {
    try {
        const query = `CALL ELIMINAR_ACTA_CONSTITUCION_X_ID_ACTA_CONSTITUCION(?);`;
        [results] = await connection.query(query,[idActaConstitucion]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaConstitucion", error);
        return 0;
    }
    return 1;
}

async function eliminarXProyecto(idProyecto){
    // const { idProductBacklog } = req.body;
    console.log(`Procediendo: Eliminar/ActaConstitucion del Proyecto ${idProyecto}...`);
    try {
        const result = await funcEliminarXProyecto(idProyecto);
        // res.status(200).json({
        //     message: "Product Backlog eliminado"});
        console.log(`ActaConstitucion del Proyecto ${idProyecto} eliminado.`);
    } catch (error) {
        console.log("ERROR 1 en Eliminar/ActaConstitucion X Proyecto", error);
    }
}

async function funcEliminarXProyecto(idProyecto) {
    try {
        const query = `CALL ELIMINAR_ACTA_CONSTITUCION_X_ID_PROYECTO(?);`;
        [results] = await connection.query(query,[idProyecto]);
    } catch (error) {
        console.log("ERROR 2 en Eliminar/ActaConstitucion X Proyecto", error);
        return 0;
    }
    return 1;
}

////////
//HITO//
////////
async function listarHito(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_HITOAC_X_AC(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const hitoAC = results[0];
        res.status(200).json({hitoAC, message: "HitoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarHito(req,res,next){
    const{idProyecto, descripcion, fechaLimite} = req.body;
    const query = `
        CALL INSERTAR_HITOAC(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto,descripcion,fechaLimite]);
        const idHito = results[0][0].idHito;
        console.log(`Se insertó el hito ${idHito}!`);
        res.status(200).json({
            idHito,
            message: "Hito insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function modificarHito(req,res,next){
    const{ idHito, descripcion, fechaLimite} = req.body;
    const query = `
        CALL MODIFICAR_HITOAC(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idHito,descripcion,fechaLimite]);
        const idHitoNew = results[0][0].idHito;
        console.log(`Se modifico el hito ${idHitoNew}!`);
        res.status(200).json({
            message: "Hito modificado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarHito(req,res,next){
    const{idHito} = req.body;
    const query = `CALL ELIMINAR_HITOAC(?);`;
    try {
        const [results] = await connection.query(query,[idHito]);
        const idHitoEliminado = results[0][0].idHito;
        console.log(`Se elimino el hito ${idHitoEliminado}!`);
        res.status(200).json({
            idHitoEliminado,
            message: "Hito eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}
//////////////
//INTERESADO//
//////////////
async function listarInteresados(req,res,next){
    const {idProyecto} = req.params;
    try {
        const query = `CALL LISTAR_INTERESADOAC_AC(?);`;
        const [results] = await connection.query(query,[idProyecto]);
        const interesadoAC = results[0];
        res.status(200).json({interesadoAC, message: "InteresadoAC listado"});
    } catch (error) {
        next(error);
    }
}
async function insertarInteresado(req,res,next){
    const{idProyecto, nombre, cargo, organizacion} = req.body;
    const query = `
        CALL INSERTAR_INTERESADOAC(?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto,nombre,cargo,organizacion]);
        const idInteresado = results[0][0].idInteresado;
        console.log(`Se insertó el interesado ${idInteresado}!`);
        res.status(200).json({
            idInteresado,
            message: "InteresadoAC insertada exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function modificarInteresado(req,res,next){
    const{idInteresado, nombre, cargo, organizacion} = req.body;
    const query = `
        CALL MODIFICAR_INTERESADOAC(?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idInteresado,nombre,cargo,organizacion]);
        const idInteresadoNew = results[0][0].idInteresado;
        console.log(`Se modifico el interesado ${idInteresadoNew}!`);
        res.status(200).json({
            idInteresadoNew,
            message: "Interesado modificado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

async function eliminarInteresado(req,res,next){
    const{idInteresado} = req.body;
    const query = `CALL ELIMINAR_INTERESADOAC(?);`;
    try {
        const [results] = await connection.query(query,[idInteresado]);
        const idInteresadoEliminado = results[0][0].idInteresado;
        console.log(`Se elimino el interesado ${idInteresadoEliminado}!`);
        res.status(200).json({
            idInteresadoEliminado,
            message: "Interesado eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    listar,
    modificarCampos,
    crearCampos,
    eliminarCampo,
    eliminar,
    eliminarXProyecto,
    listarInteresados,
    insertarInteresado,
    listarHito,
    insertarHito,
    modificarHito,
    eliminarHito,
    modificarInteresado,
    eliminarInteresado
};
