const connection = require("../config/db");

async function crear(req,res,next){
    const {idProyecto,fechaInicio,fechaFin} = req.body;
    try {
        const query = `INSERT INTO Cronograma (idProyecto,fechaInicio,fechaFin) VALUES (?,?,?)`;
        await connection.query(query,[idProyecto,fechaInicio,fechaFin]);
        res.status(200).json({message: "Cronograma creado"});
    } catch (error) {
        next(error);
    }
}

module.exports.crear = crear;