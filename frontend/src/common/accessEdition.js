import { toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

export function accessEdition(
    idLinea,
    idHerramienta,
    idUsuario,
    functionAfter
) {
    if (idHerramienta === 4) {
        // const url =
        //     process.env.NEXT_PUBLIC_BACKEND_URL +
        //     `/api/proyecto/cronograma/verificarAccesoEdicion`;

        // const objToSend = {
        //     idTarea: idLinea,
        //     idUsuario: idUsuario,
        // };

        // axios
        //     .post(url, objToSend)
        //     .then(function (response) {
        //         console.log(response);
        //         if (response.data.resultadoAcceso === 0) {
        //             toast.info(
        //                 response.data.usuarioEditando.nombres +
        //                     " esta editando esta tarea"
        //             );
        //         }
        //         else{
                     functionAfter();
            //     }
            // })
            // .catch(function (error) {
            //     toast.error("Error al solicitar acceso de edicion");
            //     console.log(error);
            // });
    }
}

export function exitEdition(
    idLinea,
    idHerramienta,
    functionAfter
){
    if(idHerramienta === 4){
        // const url =
        //     process.env.NEXT_PUBLIC_BACKEND_URL +
        //     `/api/proyecto/cronograma/salirEdicionTarea`;

        // const objToSend = {
        //     idTarea: idLinea,
        // };

        // axios
        //     .post(url, objToSend)
        //     .then(function (response) {
        //         console.log(response);
                functionAfter();
            // })
            // .catch(function (error) {
            //     toast.error("Error al salir de edicion");
            //     console.log(error);
            // });
    }
}
