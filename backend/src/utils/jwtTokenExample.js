    const { tokenProyePUCP } = req.cookies;

    try{
        const payload = jwt.verify(tokenProyePUCP, secret);
        console.log(payload);
        const idUsuario = payload.user.id;
        //Insertar query aca

    }catch(error){
        return res.status(401).send(error.message + " invalid tokenProyePUCP token");
    }