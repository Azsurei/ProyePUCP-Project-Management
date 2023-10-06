const express = require('express');
const connection = require('../config/db');
const routerEquipo = express.Router();
const { verifyToken } = require('../middleware/middlewares');


routerEquipo.post("/insertarEquipoYParticipantes",async(req,res)=>{
    //Insertar query aca
    const {idProyecto,nombre,descripcion,usuarios} = req.body;
    console.log("Llegue a recibir solicitud insertar componente edt");
    const query = `
        CALL INSERTAR_EQUIPO(?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idProyecto, nombre, descripcion]);
        const idEquipo = results[0][0].idEquipo;
        console.log(`Se creo el equipo${idEquipo}!`);
        // Iteracion
        for (const usuario of usuarios) {
            if(usuario.data!==""){
                const [usuarioXEquipoRows] = await connection.execute(`
                CALL INSERTAR_USUARIO_X_EQUIPO(
                    ${usuario.idUsuario},
                    '${idEquipo}'
                );
                `);
                const idUsuarioXEquipo = usuarioXEquipoRows[0][0].idUsuarioXEquipo;
                console.log(`Se insertó el usuario ${usuario.idUsuario} en el equipo ${idEquipo}`);
            }
        }
        res.status(200).json({
            idEquipo,
            message: "Equipo insertado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerEquipo.get("/test/:testId", (req, res) => {
    res.send(req.params);
});

module.exports.routerEquipo = routerEquipo;