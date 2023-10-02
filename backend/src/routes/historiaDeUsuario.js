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

routerHistoriaDeUsuario.get("/test/:testId", (req, res) => {
    res.send(req.params);
});


module.exports.routerHistoriaDeUsuario = routerHistoriaDeUsuario;