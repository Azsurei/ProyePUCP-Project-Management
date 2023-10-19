const connection = require("../../config/db");

async function crear(req,res,next){
    const {idProyecto,presupuestoInicial} = req.body;
    try {
        const query = `CALL INSERTAR_PRESUPUESTO(?,?);`;
        await connection.query(query,[idProyecto,presupuestoInicial]);
        res.status(200).json({message: "Presupuesto creada"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear
};