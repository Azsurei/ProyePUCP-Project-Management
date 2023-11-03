const connection = require("../../config/db");

async function cambiarPassword(req,res,next){
    const {idUsuario,password} = req.body;
    try {
        const query = `CALL CAMBIAR_PASSWORD_CUENTA_USUARIO(?,?);`;
        await connection.query(query,[idUsuario,password]);
        res.status(200).json({message: `Password modificada`});
    } catch (error) {
        next(error);
    }
}
module.exports = {
    cambiarPassword
}