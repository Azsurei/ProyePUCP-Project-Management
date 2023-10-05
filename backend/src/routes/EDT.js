const express = require("express");
const connection = require("../config/db");
const routerEDT = express.Router();
const {verifyToken} = require('../middleware/middlewares');



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


routerEDT.get("/:idEDT/listarComponentesEDT",verifyToken, async (req, res) => {
    console.log("Llegue a recibir solicitud listar componentes EDT");

    const idEDT = req.params.idEDT;
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
            componentesEDT: arraySent,
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
});

routerEDT.get("/:idProyecto/listarEDT",verifyToken, async (req, res) => {
    console.log("Llegue a recibir solicitud listar EDT por proyecto");

    const idProyecto = req.params.idProyecto;

    const query = `
        CALL LISTAR_EDT_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        console.log(results[0]);

        res.status(200).json({
            EDT: results[0],
            message: "EDT obtenido exitosamente",
        });
        console.log(
            `Se han listado el EDT para el proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener el EDT:", error);
        res.status(500).send(
            "Error al obtener el EDT: " + error.message
        );
    }
});

routerEDT.get("/:idProyecto/listarComponentesEDTXIdProyecto",verifyToken, async (req, res) => {
    console.log("Llegue a recibir solicitud listar EDT por proyecto");

    const idProyecto = req.params.idProyecto;

    const query = `
        CALL LISTAR_COMPONENTES_EDT_X_ID_PROYECTO(?);
    `;
    try {
        const [results] = await connection.query(query, [idProyecto]);
        console.log(results[0]);
        const arraySent = fullyRestructureArray(results[0]);

        res.status(200).json({
            componentesEDT: arraySent,
            message: "Componentes EDT obtenido exitosamente",
        });
        console.log(
            `Se han listado los componentes EDT para el proyecto ${idProyecto}!`
        );
    } catch (error) {
        console.error("Error al obtener los componentes EDT:", error);
        res.status(500).send(
            "Error al obtener los componentes EDT: " + error.message
        );
    }

});

routerEDT.post("/:idProyecto/insertarComponenteEDT",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de crear un componenteEDT");
    //Insertar query aca
    const {idElementoPadre, idProyecto, descripcion, codigo, observaciones, nombre, responsables, 
        fechaInicio, fechaFin, recursos, hito, criterioAceptacion, entregables} = req.body;
    console.log("Llegue a recibir solicitud insertar componente edt");
    const query = `
        CALL INSERTAR_COMPONENTE_EDT(?,?,?,?,?,?,?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idElementoPadre, idProyecto, descripcion, codigo, observaciones, 
            nombre, responsables, fechaInicio, fechaFin, recursos, hito]);
        const idComponenteEDT = results[0][0].idComponenteEDT;
        console.log(`Se creo el componente EDT ${idComponenteEDT}!`);
        // Iteracion
        for (const criterio of criterioAceptacion) {
            const [criterioAceptacionRows] = await connection.execute(`
            CALL INSERTAR_CRITERIOS_ACEPTACION(
                ${idComponenteEDT},
                '${criterio.data}'
            );
            `);
            const idComponenteCriterioDeAceptacion = criterioAceptacionRows[0][0].idComponenteCriterioDeAceptacion;
            console.log(`Se insertó el criterio de aceptacion: ${idComponenteCriterioDeAceptacion}`);
        }
        for (const entregable of entregables) {
            const [entregableRows] = await connection.execute(`
            CALL INSERTAR_ENTREGABLE(
                '${entregable.data}',
                ${idComponenteEDT}
            );
            `);
            const idEntregable  = entregableRows[0][0].idEntregable;
            console.log(`Se insertó el entregable: ${idEntregable}`);
        }
        res.status(200).json({
            idComponenteEDT,
            message: "Componente EDT insertado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerEDT.post("/:idProyecto/modificarComponenteEDT",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de modificar un componenteEDT");
    //Insertar query aca
    const {idComponenteEDT, idElementoPadre, idProyecto, descripcion, codigo, observaciones, nombre, responsables, 
        fechaInicio, fechaFin, recursos, hito, criterioAceptacion, entregables} = req.body;
    console.log("Llegue a recibir solicitud insertar componente edt");
    const query = `
        CALL MODIFICAR_COMPONENTE_EDT(?,?,?,?,?,?,?,?,?,?,?,?);
    `;
    try {
        const [results] = await connection.query(query,[idComponenteEDT, idElementoPadre, idProyecto, descripcion, codigo, observaciones, 
            nombre, responsables, fechaInicio, fechaFin, recursos, hito]);
        const idComponente= results[0][0].idComponenteEDT;
        console.log(`Se modifico el componente EDT ${idComponente}!`);
        // Pendiente (Falta preguntar)
        // Iteracion
        // for (const criterio of criterioAceptacion) {
        //     const [criterioAceptacionRows] = await connection.execute(`
        //     CALL INSERTAR_CRITERIOS_ACEPTACION(
        //         ${idComponenteEDT},
        //         '${criterio.data}'
        //     );
        //     `);
        //     const idComponenteCriterioDeAceptacion = criterioAceptacionRows[0][0].idComponenteCriterioDeAceptacion;
        //     console.log(`Se insertó el criterio de aceptacion: ${idComponenteCriterioDeAceptacion}`);
        // }
        // for (const entregable of entregables) {
        //     const [entregableRows] = await connection.execute(`
        //     CALL INSERTAR_ENTREGABLE(
        //         '${entregable.data}',
        //         ${idComponenteEDT}
        //     );
        //     `);
        //     const idEntregable  = entregableRows[0][0].idEntregable;
        //     console.log(`Se insertó el entregable: ${idEntregable}`);
        // }
        res.status(200).json({
            idComponenteEDT,
            message: "Componente EDT modificado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerEDT.post("/:idProyecto/eliminarComponenteEDT",verifyToken,async(req,res)=>{
    console.log("Llegue a recibir solicitud de eliminar un componenteEDT");
    //Insertar query aca
    const {idEDT, codigo} = req.body;
    console.log("Llegue a recibir solicitud eliminar componente edt");
    const query = `
        CALL ELIMINAR_COMPONENTEEDT(?,?);
    `;
    try {
        await connection.query(query,[idEDT,codigo]);
        console.log(`Se elimino el componente EDT ${codigo}!`);
        res.status(200).json({
            codigo,
            message: "Componente EDT eliminado exitosamente",
            
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).send("Error en el registro: " + error.message);
    }
})

routerEDT.post("/listarComponenteEDT",async(req,res)=>{
    console.log("Llegue a recibir solicitud listar Componente EDT");
    const {idComponente} = req.body;
    const query = `
        CALL LISTAR_COMPONENTE_EDT(?);
    `;
    try {
        const [results] = await connection.query(query,[idComponente]);
        console.log(results[0]);
        const [criterioAceptacion] = await connection.execute(`
            CALL LISTAR_CRITERIO_X_IDCOMPONENTE(${idComponente});
        `);
        const [entregables] = await connection.execute(`
            CALL LISTAR_ENTREGABLE_X_IDCOMPONENTE(${idComponente});
        `);
        const componenteEDT = {
            component: results[0],
            criteriosAceptacion: criterioAceptacion[0],
            entregables: entregables[0]
        };
        res.status(200).json({
            componenteEDT,
            message: "Componente EDT obtenido exitosamente"
        });
        console.log('Si se listo Componente EDT');
    } catch (error) {
        console.error("Error al obtener Componente EDT:", error);
        res.status(500).send("Error al obtener Componente EDT: " + error.message);
    }
})
module.exports.routerEDT = routerEDT;
