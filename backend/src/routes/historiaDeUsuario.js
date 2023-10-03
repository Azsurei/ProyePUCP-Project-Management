const express = require('express');
const connection = require('../config/db');
const jwt = require("jsonwebtoken");

const secret = "oaiscmawiocnaoiwncioawniodnawoinda";
const routerHistoriaDeUsuario = express.Router();

routerHistoriaDeUsuario.post("/eliminarHistoria",async(req,res)=>{

    const { tokenProyePUCP } = req.cookies;

    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idHU = req.body.idHistoriaDeUsuario;
        //Insertar query aca
        const query = `
            CALL ELIMINAR_HISTORIA_DE_USUARIO(?);
        `;
        try {
            const [results] = await connection.query(query,[idHU]);
            res.status(200).json({
                HU: results[0],
                message: "Historia de usuario eliminada correctamente"
            });
            console.log(`Se ha eliminado la historia de usuario ${idHU}!`);
            console.log(results);
        } catch (error) {
            console.error("Error al eliminar historia de usuario:", error);
            res.status(500).send("Error al eliminar historia de usuario: " + error.message);
        }
    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }
})

routerHistoriaDeUsuario.get("/:idHistoriaDeUsuario/detallesHistoria", async (req, res) => {

    const { tokenProyePUCP } = req.cookies;

    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        //console.log(payload);
        const idUsuario = payload.user.id;
        //Insertar query aca

        const { idHistoriaDeUsuario} = req.params;
        console.log(`Llegue a recibir solicitud listar HU${idHistoriaDeUsuario}`);
        const query = `
            CALL LISTAR_HISTORIA_DE_USUARIO_DETALLES(?);
        `;
        try {
            const [results] = await connection.query(query,[idHistoriaDeUsuario]);
            res.status(200).json({
                historiaDeUsuario: results[0],
                message: "Historia obtenida exitosamente"
            });
            console.log(`Se han listado la historia de usuario ${idHistoriaDeUsuario}!`);
            console.log(results);
        } catch (error) {
            console.error("Error al obtener la historia de usuario:", error);
            res.status(500).send("Error al obtener la historia de usuario: " + error.message);
        }

    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }

    
});

routerHistoriaDeUsuario.get("/test/:testId", (req, res) => {
    res.send(req.params);
});


module.exports.routerHistoriaDeUsuario = routerHistoriaDeUsuario;