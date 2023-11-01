const connection = require("../../config/db");

async function listarAutoridad(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_AUTORIDAD;`;
        const [results] = await connection.query(query);
        const autoridades = results[0];
        res.status(200).json({autoridades, message: "Autoridades listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function listarAdhesion(req,res,next){
    try {
        const query = `CALL LISTAR_INTERESADO_ADHESION;`;
        const [results] = await connection.query(query);
        const adhesiones = results[0];
        res.status(200).json({adhesiones, message: "Adhesiones listado"});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


async function insertarInteresado(req,res,next){
    const {cargo, correoElectronico, idAdhesionActual, idAdhesionDeseada, idAutoridad, idProyecto, informacionContacto, nombre, numeroTelefono, organizacion, rol,
        requeriments,strategies} = req.body;
    try {
        // Insertar Interesado
        const query = `CALL INSERTAR_INTERESADO(?,?,?,?,?,?,?,?,?,?,?);`;
        const [results] = await connection.query(query,[idProyecto,nombre,rol,organizacion,cargo,correoElectronico,numeroTelefono,informacionContacto,idAutoridad,
            idAdhesionActual,idAdhesionDeseada]);
        const idInteresado = results[0][0].idInteresado;
        //Iteracion Requerimientos
        for(const requeriment of requeriments){
            await connection.query(`
                CALL INSERTAR_INTERESADO_REQUERIMIENTO(
                ${idInteresado},
                ${requeriment.descripcion});
            `);
        }
        //Iteracion Estrategia
        for(const strategy of strategies){
            await connection.query(`
                CALL INSERTAR_INTERESADO_ESTRATEGIA(
                ${idInteresado},
                ${strategy.descripcion});
            `);
        } 
        res.status(200).json({
            message: "Se ha insertado exitosamente"
        });
    } catch (error) {
        console.error("Error en la inserción:", error);
        res.status(500).send("Error en la inserción: " + error.message);
    }
}

async function listarInteresado(req,res,next){
    const {idProyecto} = req.params;
    const query = `CALL LISTAR_CATALOGO_INTERESADOS(?);`;
    try {
        const [results] = await connection.query(query,[idProyecto]);
        const interesados = results[0];
        res.status(200).json({
            interesados,
            message: "Interesados obtenidos exitosamente"
        });
        console.log('Se listaron los interesados correctamente');
    } catch (error) {
        console.log(error);
        next(error);
    }
}
module.exports = {
    listarAutoridad,
    listarAdhesion,
    insertarInteresado,
    listarInteresado
};
