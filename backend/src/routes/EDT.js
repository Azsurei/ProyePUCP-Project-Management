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
    return children.map((child) => {
        const componentesHijos = restructureArray(array, child.idComponente);
        
        let nextSon;
        if (componentesHijos != null) {
            let stringCodigo = componentesHijos[componentesHijos.length - 1].codigo;
            const lastDigit = parseInt(stringCodigo[stringCodigo.length - 1]) + 1;
            stringCodigo = stringCodigo.slice(0, -1) + lastDigit;
            nextSon = stringCodigo;
        } else {
            nextSon = child.codigo + '.1';
        }
        
        return {
            ...child,
            componentesHijos,
            nextSon,
        };
    });
}
function fullyRestructureArray(arregloOriginal){
    const topLevelParents = arregloOriginal.filter(
        (component) => component.idElementoPadre === 1
    );
    const restructuredArray = topLevelParents.map((parent) => {
        const componentesHijos = restructureArray(arregloOriginal, parent.idComponente);

        let nextSon;
        if (componentesHijos != null) {
            let stringCodigo = componentesHijos[componentesHijos.length - 1].codigo;
            const lastDigit = parseInt(stringCodigo[stringCodigo.length - 1]) + 1;
            stringCodigo = stringCodigo.slice(0, -1) + lastDigit;
            nextSon = stringCodigo;
        } else {
            nextSon = parent.codigo + '.1';
        }

        return {
            ...parent,
            componentesHijos,
            nextSon,
        };
    });
    

    return restructuredArray;
}


routerEDT.get("/:idEDT/listarEDT", async (req, res) => {
    console.log("Llegue a recibir solicitud listar componentes EDT");

    const { tokenProyePUCP } = req.cookies;

    try {
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;

<<<<<<< HEAD
        const idEDT = req.params.idEDT;
=======
        const idProyecto = req.params.idEDT;
>>>>>>> 37d5219050e462c7ac062ed0e4114dbfcba6ace2

        const query = `
            CALL LISTAR_COMPONENTES_EDT_X_ID_EDT(?);
        `;
        try {
            const [results] = await connection.query(query, [idEDT]);
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
