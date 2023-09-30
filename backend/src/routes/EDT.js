const express = require("express");
const connection = require("../config/db");
const routerEDT = express.Router();

const jwt = require("jsonwebtoken");
const secret = "oaiscmawiocnaoiwncioawniodnawoinda";






//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  Funcion que reestructura arreglo para poder usarlo en frontend
function restructureArray(array, parentId) {
    const children = array.filter(
        (component) => component.idElementoPadre === parentId
    );
    if (children.length === 0) {
        return null;
    }
    return children.map((child) => ({
        ...child,
        componentesHijos: restructureArray(array, child.idComponente),
    }));
}

function fullyRestructureArray(arregloOriginal){
    const topLevelParents = arregloOriginal.filter(
        (component) => component.idElementoPadre === 1
    );
    const restructuredArray = topLevelParents.map((parent) => ({
        ...parent,
        componentesHijos: restructureArray(arregloOriginal, parent.idComponente),
    }));

    return restructuredArray;
}


routerEDT.get("/:idProyecto/listarEDT", async (req, res) => {
    console.log("Llegue a recibir solicitud listar componentes EDT");

    const { tokenProyePUCP } = req.cookies;

    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;

        const idProyecto = req.params.idProyecto;

        const query = `
            CALL LISTAR_COMPONENTES_EDT_X_ID_PROYECTO(?);
        `;
        try {
            const [results] = await connection.query(query, [idProyecto]);
            console.log(results[0]);
            const arraySent = fullyRestructureArray(results[0]);

            //const newArray = fullyRestructureArray(results[0]);
            //console.log(newArray);

            
            res.status(200).json({
                componentes: arraySent,
                message: "ComponentesEDT obtenidos exitosamente",
            });
            console.log(
                `Se han listado los componentesEDT para el usuario ${idUsuario} en su proyecto ${idProyecto}!`
            );
        } catch (error) {
            console.error("Error al obtener los componentesEDT:", error);
            res.status(500).send(
                "Error al obtener los componentesEDT: " + error.message
            );
        }
    } catch (error) {
        return res
            .status(401)
            .send(error.message + " invalid tokenProyePUCP token");
    }
});

module.exports.routerEDT = routerEDT;
