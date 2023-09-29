const express = require('express');
const connection = require('../config/db');
const routerHerramientas = express.Router();
const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";


routerHerramientas.get("/listarHerramientas",async(req,res)=>{

    const { tokenProyePUCP } = req.cookies;

    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        console.log("Llegue a recibir solicitud listar Herramientas");
        const query = `
            CALL LISTAR_HERRAMIENTAS;
        `;
        try {
            const [results] = await connection.query(query);
            res.status(200).json({
                herramientas: results[0],
                message: "Herramientas obtenidas exitosamente"
            });
            console.log('Si se listarion las herramientas');
        } catch (error) {
            console.error("Error al obtener las herramientas:", error);
            res.status(500).send("Error al obtener las herramientas: " + error.message);
        }
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
})



module.exports.routerHerramientas = routerHerramientas;